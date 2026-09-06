"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useUserDataContext } from "../../Context/store";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function Chat() {
  const { userData, setUserData } = useUserDataContext();
  const [user, setUser] = useState<ProfileData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const id = pathname.replace("/profile/", "");
    const storedData = sessionStorage.getItem("userData");
    const profiles = userData ?? (storedData ? JSON.parse(storedData) : null);

    if (!userData && profiles) {
      setUserData(profiles);
    }

    setUser(
      profiles?.find((profile: ProfileData) => profile.id === id) ?? null
    );
  }, [pathname, setUserData, userData]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer?.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = input.trim();

    if (!question || !user || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };
    const assistantId = crypto.randomUUID();
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          profile: { name: user.name, age: user.age },
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("The chat request failed.");
      }

      setMessages((current) => [
        ...current,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: message.content + chunk }
              : message
          )
        );
      }
    } catch (error) {
      console.error(error);
      setMessages((current) => [
        ...current.filter((message) => message.id !== assistantId),
        {
          id: assistantId,
          role: "assistant",
          content: "Sorry, I couldn't answer that just now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col ">
      <div className="border-2 max-h-screen flex-1 scroll-snap-y-container overflow-auto bg-white p-8 message-container" ref={scrollContainerRef}>
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
                  <div className={`col-start-3 col-end-6 border-2 shadow-md rounded pl-2 bg-yellow-50 py-3 ai-message-content-${messages.length}`}>
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
        <div className="message-end pb-[110px]"></div>
      </div>

      <div className="sticky bottom-0 ">
        <form
          onSubmit={handleSubmit}
          className="px-8 py-8 mt-auto flex items-center  bg-white border-t-2 border-gray-200"
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Add your question here"
            className="bg-white border-2 border-slate-400 p-4 rounded-md focus:outline-green-700 flex-1"
          />
          <button
            disabled={!input.trim() || !user || isLoading}
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
