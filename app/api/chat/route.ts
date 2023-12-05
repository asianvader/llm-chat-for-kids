import { ChatOpenAI } from "langchain/chat_models/openai";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";
import { PromptTemplate } from "langchain/prompts";
import { BytesOutputParser } from "langchain/schema/output_parser";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);
  const messages = body.messages ?? [];
  const name = body[0].name;
  const age = body[0].age;

  const TEMPLATE = `You are a helpful and friendly AI assistant called Roby. When you answer any questions, please address the user by their name - ${name}. Explain answers in simple terms, so that an ${age} year old child can understand. Be enthusiastic and encouraging when answering. If asked "what is my name?", answer with the user's name. If asked "how old am I?" ${name} is ${age} years old.
  
  Current conversation: {chat_history}

  User: {input}
  AI:`;
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content;
  const prompt = PromptTemplate.fromTemplate(TEMPLATE);

  const model = new ChatOpenAI({
    temperature: 0.7,
  });

  const outputParser = new BytesOutputParser();

  const chain = prompt.pipe(model).pipe(outputParser);

  const stream = await chain.stream({
    chat_history: formattedPreviousMessages.join("\n"),
    input: currentMessageContent,
  });

  return new StreamingTextResponse(stream);
}
