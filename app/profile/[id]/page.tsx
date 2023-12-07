"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useChat } from "ai/react";
import { useUserDataContext } from "../../Context/store";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DocumentData } from "firebase-admin/firestore";
import Image from "next/image";
import { set } from "firebase/database";

function Chat() {
  const { userData, setUserData } = useUserDataContext();
  const [user, setUser] = useState<DocumentData | null>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: user || {},
  });
  const messagesRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    const id = pathname.replace("/profile/", "");
    if (!userData) {
      const data = sessionStorage.getItem("userData");
      const profiles = data ? JSON.parse(data) : null;
      setUserData(profiles);
      setUser(profiles?.find((user: DocumentData) => user.id === id));
    } else {
      const filteredProfile = userData?.filter((profile) => profile.id === id);
      setUser(filteredProfile);
      console.log("user", filteredProfile);
    }
  }, []);

  useEffect(() => {
    if (messages.length) {
      setTimeout(() => {
        messagesRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 1000);
    }
  }, [messages.length]);

  return (
    <div className="h-screen flex flex-col ">
      <div className="border-2 max-h-screen flex-1 scroll-snap-y-container overflow-auto bg-white p-8">
        {messages.map((m) => (
          <div key={m.id} className="message-content">
            {m.role === "user" ? (
              <>
                <div className="grid grid-cols-6 gap-4 my-2">
                  <div className="col-start-1 col-end-2 col-span-1 justify-self-end">
                    <img
                      src={
                        user?.avatarUrl ||
                        `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.name}`
                      }
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
        <div className="message-end pb-[110px]" ref={messagesRef}></div>
      </div>

      <div className="sticky bottom-0 ">
        <form
          onSubmit={handleSubmit}
          className="px-8 py-8 mt-auto flex items-center  bg-white border-t-2 border-gray-200"
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
    </div>
  );
}

export default Chat;
