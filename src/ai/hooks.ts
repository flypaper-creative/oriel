import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export async function generateCode(prompt: string) {
  const res = await client.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  return res.choices[0]?.message?.content;
}
