export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server missing OPENAI_API_KEY" });
    }

    const {
      purpose,
      audience,
      tone,
      length,
      includeSubject,
      context
    } = req.body || {};

    if (!purpose || !context) {
      return res.status(400).json({ error: "Missing required fields: purpose, context" });
    }

    const lengthGuide = {
      short: "3–6 sentences",
      medium: "6–10 sentences",
      long: "10–14 sentences"
    }[length] || "6–10 sentences";

    const systemStyle = `
You are an expert email writing assistant.
Write a clear, professional email with strong structure and natural phrasing.
Avoid overly flowery language. Be direct, polite, and specific.
If the user requests a subject line, include it on the first line as: "Subject: ...".
Then include a blank line, then the email body.
`;

    const userPrompt = `
Write an email draft with these requirements:

- Purpose: ${purpose}
- Audience: ${audience}
- Tone: ${tone}
- Length: ${lengthGuide}
- Include subject line: ${includeSubject ? "Yes" : "No"}

Key details/context:
${context}

Output format rules:
- If include subject line = Yes, begin with: Subject: ...
- Then one blank line
- Then email body
`;

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: systemStyle },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      const msg = data?.error?.message || "OpenAI request failed";
      return res.status(openaiRes.status).json({ error: msg });
    }

    const text =
      data.output_text ||
      data?.output?.[0]?.content?.map((c) => c.text).join("") ||
      "";

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}
