import OpenAI from "openai";
import { NextRequest } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  messages?: ChatMessage[];
  profile?: {
    id?: string;
    name?: string;
    age?: string;
  };
};

const MODERATED_RESPONSE =
  "I can’t help with that. If something is worrying or upsetting you, please talk to a parent, teacher, or another trusted grown-up. We can also chat about something safe and fun together.";

const SELF_HARM_RESPONSE =
  "I’m really glad you told me. Please tell a parent, teacher, or another trusted grown-up right now so they can help you. If you are in immediate danger, call your local emergency number.";

export async function POST(request: NextRequest) {
  const { messages = [], profile = {} } = (await request.json()) as ChatRequest;
  const name = profile.name?.trim() || "friend";
  const age = profile.age?.trim() || "young";

  if (!messages.length) {
    return Response.json({ error: "At least one message is required." }, { status: 400 });
  }

  const openai = new OpenAI();
  const latestMessage = messages.at(-1);

  if (latestMessage?.role !== "user") {
    return Response.json({ error: "The latest message must be from the user." }, { status: 400 });
  }

  try {
    const moderation = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: latestMessage.content,
    });
    const result = moderation.results[0];

    if (result?.flagged) {
      const isSelfHarm = result.categories["self-harm"] || result.categories["self-harm/intent"] || result.categories["self-harm/instructions"];
      return new Response(isSelfHarm ? SELF_HARM_RESPONSE : MODERATED_RESPONSE, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
      });
    }
  } catch (error) {
    console.error("Input moderation failed", error);
    return Response.json(
      { error: "Roby is taking a quick safety check. Please try again in a moment." },
      { status: 503 }
    );
  }

  const stream = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    instructions: `You are a helpful and friendly AI assistant called Roby. Address the child by their name, ${name}. Explain answers simply enough for a ${age}-year-old child. Be enthusiastic and encouraging. If asked for the child's name or age, answer using this profile information. Keep responses age-appropriate and safe.

You are speaking with a child. Do not provide sexual content, graphic violence, hateful or harassing language, instructions for wrongdoing, dangerous stunts, weapons, drugs, self-harm, or other unsafe activities. Do not ask for personal information, contact details, addresses, school details, photos, or secrets. If a child raises an unsafe or upsetting topic, respond calmly and briefly, do not provide details, and encourage them to talk to a trusted grown-up. For ordinary questions about difficult topics, provide a gentle, factual, age-appropriate answer without graphic detail.`,
    input: messages.map(({ role, content }) => ({ role, content })),
    safety_identifier: profile.id?.trim() || undefined,
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
