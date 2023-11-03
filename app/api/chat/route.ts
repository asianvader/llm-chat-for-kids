import { ChatOpenAI } from "langchain/chat_models/openai";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";
import { PromptTemplate } from "langchain/prompts";
import { BytesOutputParser } from "langchain/schema/output_parser";

export const runtime = 'edge';

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a helpful and friendly AI assistant for an eight year old child. When you answer any questions, explain it in simple terms so that an eight year old can understand
  
  Current conversation: {chat_history}

  User: {input}
  AI:`;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const messages = body.messages ?? [];
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
