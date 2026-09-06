import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Login from "@/components/Login";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import { SessionProvider } from "@/components/SessionProvider";
import { UserDataProvider } from "./Context/store";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roby | A friendly place to learn",
  description: "A child-friendly chat with Roby.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);
  return (
    <html lang="en" className={nunito.className}>
      <body>
        <SessionProvider session={session}>
          {!session ? (
            <Login />
          ) : (
            <UserDataProvider>{children}</UserDataProvider>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
