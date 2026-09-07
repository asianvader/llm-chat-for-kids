"use client";

import { ChevronLeftIcon, PaperAirplaneIcon, PauseIcon, SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { useUserDataContext } from "../../Context/store";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

export default function Chat() {
  const { userData, setUserData } = useUserDataContext();
  const [user, setUser] = useState<ProfileData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const id = pathname.replace("/profile/", "");
    const stored = sessionStorage.getItem("userData");
    const profiles = userData ?? (stored ? JSON.parse(stored) : null);
    if (!userData && profiles) setUserData(profiles);
    setUser(profiles?.find((profile: ProfileData) => profile.id === id) ?? null);
  }, [pathname, setUserData, userData]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }));
    return () => cancelAnimationFrame(frame);
  }, [messages]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const stopSpeaking = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setSpeakingId(null);
  };

  const speak = async (message: ChatMessage) => {
    if (!message.content || isLoading) return;
    if (speakingId === message.id) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setSpeechError(null);
    setSpeakingId(message.id);
    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message.content }),
      });
      if (!response.ok) throw new Error("Speech request failed.");

      const url = URL.createObjectURL(await response.blob());
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); setSpeakingId(null); };
      audio.onerror = () => { URL.revokeObjectURL(url); setSpeakingId(null); setSpeechError("Roby couldn’t play that aloud. Please try again."); };
      await audio.play();
    } catch (error) {
      console.error(error);
      setSpeakingId(null);
      setSpeechError("Roby couldn’t speak just now. Please try again.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || !user || isLoading) return;

    const userMessage = { id: crypto.randomUUID(), role: "user" as const, content: question };
    const assistantId = crypto.randomUUID();
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })), profile: { id: user.id, name: user.name, age: user.age } }) });
      if (!response.ok || !response.body) throw new Error("The chat request failed.");
      setMessages((current) => [...current, { id: assistantId, role: "assistant", content: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: message.content + chunk } : message));
      }
    } catch (error) {
      console.error(error);
      setMessages((current) => [...current.filter((message) => message.id !== assistantId), { id: assistantId, role: "assistant", content: "Sorry, I couldn't answer that just now. Please try again." }]);
    } finally { setIsLoading(false); }
  };

  return <main className="flex h-dvh flex-col bg-[#f8fbff]"><header className="border-b-2 border-[#dce8f2] bg-white px-4 py-3 shadow-sm"><div className="mx-auto flex max-w-4xl items-center gap-3"><button className="roby-icon-button" onClick={() => router.push("/")} aria-label="Back to profiles"><ChevronLeftIcon className="h-6 w-6" /></button><span className="grid h-11 w-11 place-items-center rounded-full bg-[#fff0c7]"><Image src="/roby-avatar.png" width={38} height={38} alt="" /></span><div><h1 className="font-black">Chat with Roby</h1><p className="text-sm font-bold text-[#2daea0]">Here to help, {user?.name ?? "friend"}!</p></div></div></header><div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6"><div className="mx-auto flex max-w-3xl flex-col gap-4">{messages.length === 0 && <div className="roby-card my-auto flex flex-col items-center p-8 text-center sm:p-12"><Image src="/roby.png" width={125} height={170} alt="Roby" className="h-auto" /><h2 className="mt-4 text-2xl font-black">Hi {user?.name ?? "friend"}!</h2><p className="mt-2 max-w-md font-semibold text-[var(--muted-ink)]">Ask me anything. We can learn about animals, make up a story, or solve a tricky question together.</p></div>}{messages.map((message) => <div key={message.id} className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>{message.role === "assistant" && <Image src="/roby-avatar.png" width={42} height={42} alt="Roby" className="mb-1 h-10 w-10" />}<div className={`max-w-[80%] rounded-3xl px-5 py-3 font-semibold leading-relaxed shadow-sm ${message.role === "user" ? "rounded-br-md bg-[#dff3ff]" : "rounded-bl-md bg-white"}`}><div>{message.content || <span className="inline-flex gap-1" aria-label="Roby is thinking"><i className="h-2 w-2 animate-bounce rounded-full bg-[#2daea0]" /><i className="h-2 w-2 animate-bounce rounded-full bg-[#2daea0] [animation-delay:150ms]" /><i className="h-2 w-2 animate-bounce rounded-full bg-[#2daea0] [animation-delay:300ms]" /></span>}</div>{message.role === "assistant" && message.content && !isLoading && <button onClick={() => speak(message)} className="mt-3 inline-flex min-h-9 items-center gap-1 rounded-full bg-[#edf5fb] px-3 py-1 text-sm font-extrabold text-[#2a527d] hover:bg-[#dceefa] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ffc857]" aria-pressed={speakingId === message.id}>{speakingId === message.id ? <PauseIcon className="h-4 w-4" /> : <SpeakerWaveIcon className="h-4 w-4" />}{speakingId === message.id ? "Stop" : "Listen"}</button>}</div>{message.role === "user" && <img src={user?.avatarUrl} width={42} height={42} alt="" className="mb-1 h-10 w-10 rounded-full bg-white" />}</div>)}{speechError && <p role="status" className="rounded-xl bg-[#fff0ee] px-4 py-3 text-sm font-bold text-[#a9433e]">{speechError}</p>}</div></div><form onSubmit={handleSubmit} className="border-t-2 border-[#dce8f2] bg-white p-3 sm:p-4"><div className="mx-auto flex max-w-3xl items-center gap-2"><label className="sr-only" htmlFor="chat-question">Your question</label><input id="chat-question" type="text" value={input} onChange={(event) => setInput(event.target.value)} placeholder={user ? `Ask Roby something, ${user.name}…` : "Loading your profile…"} className="roby-input min-h-12 flex-1" disabled={!user || isLoading} /><button disabled={!input.trim() || !user || isLoading} type="submit" className="roby-button roby-button-primary min-w-12 px-4" aria-label="Send question"><PaperAirplaneIcon className="h-5 w-5" /><span className="hidden sm:inline">Send</span></button></div></form></main>;
}
