"use client";

import { useChat } from "ai/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type you message here"
            className="bg-transparent focus:outline-none flex-1"
          />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
