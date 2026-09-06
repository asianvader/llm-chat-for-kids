import { NextRequest } from "next/server";

const MAX_TEXT_LENGTH = 5_000;

function addSentencePauses(text: string) {
  return text.replace(/([.!?])(?=\s|$)/g, '$1 <break time="0.4s" />');
}

export async function POST(request: NextRequest) {
  const { text } = (await request.json()) as { text?: unknown };

  if (typeof text !== "string" || !text.trim()) {
    return Response.json({ error: "Text is required." }, { status: 400 });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return Response.json({ error: "Text is too long to read aloud." }, { status: 400 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) {
    return Response.json({ error: "Speech is not configured." }, { status: 503 });
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/stream?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
      body: JSON.stringify({
        text: addSentencePauses(text.trim()),
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.6, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
      }),
    }
  );

  if (!response.ok || !response.body) {
    console.error("ElevenLabs TTS request failed", response.status);
    return Response.json({ error: "Roby could not speak just now." }, { status: 502 });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
