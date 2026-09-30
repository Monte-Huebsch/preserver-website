/**
 * Preserver site chatbot — RAG endpoint.
 *
 * Replaces the Dante AI embed. Runs entirely on Cloudflare's free tier
 * (Workers AI + Vectorize), in the same Cloudflare account that already
 * hosts the site, so no visitor conversation data goes to a third-party
 * chatbot vendor.
 *
 * How it answers a question:
 *   1. Embed the visitor's question (Workers AI, @cf/baai/bge-base-en-v1.5).
 *   2. Look up the closest-matching chunks of site content in Vectorize
 *      (homepage, full FAQ, all 78 use-case cards, blog posts — see
 *      tools/chatbot/extract_content.py for what's indexed).
 *   3. Ask a small instruct model to answer using ONLY those chunks, with
 *      instructions not to invent pricing, features or claims that aren't
 *      in the retrieved text.
 *
 * Knowledge base freshness: this function only ever reads the index that
 * tools/chatbot/embed_and_upsert.py last wrote. It does NOT re-crawl the
 * site itself. See tools/chatbot/README.md for the re-run instructions —
 * re-run that script any time the homepage, FAQ, a use-case card, or a
 * blog post changes, or the chatbot will keep answering from stale content.
 */

const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";
const CHAT_MODEL = "@cf/meta/llama-3.2-3b-instruct";
const TOP_K = 6;

const SYSTEM_PROMPT = `You are the Preserver website assistant, embedded on preserver.me.
Preserver is a mobile app (iOS + Android) that stamps every photo, video, voice note and text capture with time, date and GPS, works fully offline, needs no account, and lets users export an AI-ready bundle to any AI tool of their choice.

Answer ONLY using the CONTEXT provided below, which is pulled directly from the Preserver website (homepage, FAQ, use-case pages, blog).
- If the answer isn't in the context, say you're not sure and suggest checking preserver.me/faq/ or contacting support — never guess or invent pricing, features, release dates or claims.
- Keep answers short and conversational, a few sentences unless the question needs a list.
- Never claim to be a human. Never make promises about future features beyond what's in the context.
- If asked about pricing: capture is free forever; AI-ready export bundles are free during the current beta and beta users are grandfathered in free after beta ends; new users will pay a small monthly fee for Pro after beta.`;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://preserver.me",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const message = (body.message || "").toString().trim().slice(0, 1000);
  if (!message) {
    return json({ error: "Missing 'message'" }, 400);
  }

  // Keep prior turns short — just enough for follow-up questions like
  // "what about for tradies?" to resolve, without ballooning token usage.
  const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

  try {
    // 1. Embed the question.
    const embedResp = await env.AI.run(EMBEDDING_MODEL, { text: [message] });
    const vector = embedResp?.data?.[0];
    if (!vector) {
      return json({ error: "Embedding failed" }, 502);
    }

    // 2. Retrieve the closest site-content chunks.
    const matches = await env.VECTORIZE.query(vector, {
      topK: TOP_K,
      returnMetadata: "all",
    });

    const contextBlocks = (matches?.matches || [])
      .filter((m) => m.metadata?.text)
      .map((m, i) => `[${i + 1}] (${m.metadata.title || m.metadata.url}) ${m.metadata.text}`);

    const contextText = contextBlocks.length
      ? contextBlocks.join("\n\n")
      : "No matching content was found for this question.";

    // 3. Ask the model to answer, grounded in that context only.
    const messages = [
      { role: "system", content: `${SYSTEM_PROMPT}\n\nCONTEXT:\n${contextText}` },
      ...history,
      { role: "user", content: message },
    ];

    const answer = await env.AI.run(CHAT_MODEL, {
      messages,
      max_tokens: 400,
    });

    const sources = (matches?.matches || [])
      .filter((m) => m.metadata?.url)
      .map((m) => ({ url: m.metadata.url, title: m.metadata.title }))
      .filter((s, i, arr) => arr.findIndex((x) => x.url === s.url) === i)
      .slice(0, 3);

    return json({
      reply: answer?.response?.trim() || "Sorry, I couldn't generate an answer just now.",
      sources,
    });
  } catch (err) {
    return json({ error: "Something went wrong answering that.", detail: String(err) }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}
