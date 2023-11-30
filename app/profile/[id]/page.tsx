"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useChat } from "ai/react";
import { useUserDataContext } from "../../Context/store";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase-admin/firestore";

function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const { userData, setUserData } = useUserDataContext();
  const [user, setUser] = useState<DocumentData | null>(null);
  const pathname = usePathname();
  console.log("user", user);
  console.log("messages", messages);

  useEffect(() => {
    const id = pathname.replace("/profile/", "");
    if (!userData) {
      const data = sessionStorage.getItem("userData");
      console.log(data);
      const profiles = data ? JSON.parse(data) : null;
      setUserData(profiles);
      setUser(profiles?.find((user: DocumentData) => user.id === id));
    } else {
      setUser(userData?.filter((user: DocumentData) => user.id === id));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-2 flex-grow bg-gray-200 p-8">
        {messages.map((m) => (
          <div key={m.id}>
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-8 py-8 mt-auto flex items-center"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Add your question here"
          className="bg-white border-2 border-slate-400 p-4 rounded-md focus:outline-green-700 flex-1"
        />
        <button
          disabled={!input}
          type="submit"
          className="mx-3 border-2 p-3 rounded-full border-green-700 bg-green-700/20 hover:border-green-700/50 disabled:cursor-not-allowed disabled:bg-gray-200"
        >
          <PaperAirplaneIcon className="h-6 w-6 text-green-700/80" />
        </button>
      </form>
    </div>
  );
}

export default Chat;
