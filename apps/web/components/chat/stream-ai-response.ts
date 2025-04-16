import { apiUrl } from "@/lib/constants";

export const StreamAIResponse = async (
  prompt: string,
  token: string,
  onChunk: (chunk: string) => void,
) => {
  const res = await fetch(`${apiUrl}/ai/prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prompt),
  });

  const reader = res.body?.getReader();

  const decoder = new TextDecoder("utf-8");

  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    console.log("streamed res: ", chunk);
    onChunk(chunk);
  }
};
