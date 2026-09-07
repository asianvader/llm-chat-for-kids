# Roby

Roby is a child-friendly AI chat app. Parents sign in with Google, manage child profiles, and children can chat with Roby or listen to replies read aloud.

## Stack

- **Framework:** Next.js 15 (App Router), React 19, and TypeScript
- **Styling:** Tailwind CSS 3
- **Authentication:** NextAuth with Google sign-in
- **Data:** Firebase and Cloud Firestore for child profiles
- **AI:** OpenAI Responses API with streamed chat replies
- **Speech:** ElevenLabs text-to-speech for Roby's Listen feature
- **Tooling:** pnpm, ESLint, and Volta-pinned Node.js

## Setup

Requires Node `22.23.2` (pinned with Volta) and pnpm.

```bash
pnpm install
pnpm dev
```

Set the required values in `.env.local` (do not commit this file):

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
```

Firebase configuration is also required; see `firebase.ts` for the expected client configuration.

## Commands

```bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Notes

- Chat responses stream from the OpenAI Responses API.
- The Listen button uses a server-side ElevenLabs route, so the API key stays private.
