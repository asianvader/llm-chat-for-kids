"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useChat } from "ai/react";
import { useUserDataContext } from "../../Context/store";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase-admin/firestore";
import Image from "next/image";

function Chat() {
  const { userData, setUserData } = useUserDataContext();
  const [user, setUser] = useState<DocumentData | null>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: { name: user?.name, age: user?.age },
  });

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
      <div className="border-2 flex-grow bg-white p-8">
        {messages.map((m) => (
          <div key={m.id} className="message-content">
            {m.role === "user" ? (
              <>
                <div className="grid grid-cols-6 gap-4 my-2">
                  <div className="col-start-1 col-end-2 col-span-1 justify-self-end">
                    <img
                      src={user?.avatarUrl}
                      width={50}
                      height={50}
                      alt="avatar"
                      className="mr-2"
                    />
                  </div>
                  <div className="col-start-2 col-end-5 border-2 shadow-md rounded pl-2 bg-blue-50 py-3">
                    {m.content}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-6 gap-4 my-2">
                  <div className="col-start-3 col-end-6 border-2 shadow-md rounded pl-2 bg-yellow-50 py-3">
                    {m.content}
                  </div>
                  <div className="col-start-6 col-end-7 col-span-1 border-1 border-green-500">
                    <Image
                      src={"/roby-avatar.png"}
                      width={50}
                      height={50}
                      alt="AI avatar"
                      className="ml-2"
                    />
                  </div>
                </div>
              </>
            )}
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
