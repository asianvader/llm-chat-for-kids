"use client";

import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import FetchProfiles from "@/components/FetchProfiles";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const router = useRouter();

  const handleOnClick = () => {
    router.push("/addProfile");
  }

  return (
    <>
      <FetchProfiles />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6 " onClick={handleOnClick}>
        Add new profile
      </button>

      {/* {router.push("/addProfile")} */}
      {/* <div>
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
    </div> */}
    </>
  );
}
