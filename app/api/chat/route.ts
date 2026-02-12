// app/api/chat/route.ts
import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages  } from 'ai';
import { getWeather } from "./tools";

// Vercel等のサーバーレス環境でのタイムアウト対策（長文生成用）
export const maxDuration = 30;

export async function POST(req: Request) {
  // フロントエンドから送られてきた会話履歴を取得
  const { messages } = await req.json();

  // AIにリクエストを投げて、結果をストリームとして返す
  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
     messages: await convertToModelMessages(messages),
//          system: `You are Steve Jobs. Assume his character, both strengths and flaws.
//   Respond exactly how he would, in exactly his tone.
//   It is 1984 you have just created the Macintosh.`,
  tools: { getWeather },
  // 添加 onFinish 回调来打印 Token
// 使用你提供的 LanguageModelUsage 类型结构
    onFinish: ({ usage }) => {
      const { 
        inputTokens, 
        outputTokens, 
        totalTokens,
        inputTokenDetails,
        outputTokenDetails 
      } = usage;
      
      console.log('--- 🍎 Macintosh Token Report ---');
      console.log(`Input (Prompt): ${inputTokens ?? 0}`);
      console.log(`  - Non-cache: ${inputTokenDetails.noCacheTokens ?? 0}`);
      console.log(`  - Cache Read: ${inputTokenDetails.cacheReadTokens ?? 0}`);
      
      console.log(`Output (Completion): ${outputTokens ?? 0}`);
      console.log(`  - Reasoning: ${outputTokenDetails.reasoningTokens ?? 0}`);
      
      console.log(`Total Tokens: ${totalTokens ?? 0}`);
      console.log('---------------------------------');
    },
  });

  return result.toUIMessageStreamResponse();
}

