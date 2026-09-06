import OpenAI from "openai";
import { NextRequest } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  messages?: ChatMessage[];
  profile?: {
    name?: string;
    age?: string;
  };
};

export async function POST(request: NextRequest) {
  const { messages = [], profile = {} } = (await request.json()) as ChatRequest;
  const name = profile.name?.trim() || "friend";
  const age = profile.age?.trim() || "young";

  if (!messages.length) {
    return Response.json({ error: "At least one message is required." }, { status: 400 });
  }

  const openai = new OpenAI();
  const stream = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    instructions: `You are a helpful and friendly AI assistant called Roby. Address the child by their name, ${name}. Explain answers simply enough for a ${age}-year-old child. Be enthusiastic and encouraging. If asked for the child's name or age, answer using this profile information. Keep responses age-appropriate and safe.`,
    input: messages.map(({ role, content }) => ({ role, content })),
    stream: true,
  });

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        for await (const event of stream) {
          if (event.type === "response.output_text.delta") {
            controller.enqueue(encoder.encode(event.delta));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
