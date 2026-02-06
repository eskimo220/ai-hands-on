// app/api/chat/route.ts
import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages  } from 'ai';

// Vercel等のサーバーレス環境でのタイムアウト対策（長文生成用）
export const maxDuration = 30;

export async function POST(req: Request) {
  // フロントエンドから送られてきた会話履歴を取得
  const { messages } = await req.json();

  // AIにリクエストを投げて、結果をストリームとして返す
  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
     messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

