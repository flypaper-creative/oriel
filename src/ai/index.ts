const key = (import.meta as any).env?.VITE_OPENAI_API_KEY || (typeof process !== 'undefined' ? (process as any).env?.OPENAI_API_KEY : '')
export async function generateText(prompt: string): Promise<string> {
  if (!key) return `[stub] ${prompt.slice(0, 96)} …`
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role:'system', content:'You are oriel’s narrative assistant.' },
        { role:'user',   content: prompt }
      ],
      temperature: 0.7
    })
  })
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`)
  const json: any = await res.json()
  return json?.choices?.[0]?.message?.content ?? ''
}
