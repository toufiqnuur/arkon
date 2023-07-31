import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import "./globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { useUser } from "~/store";
import { UserInit } from "~/store/StoreInit";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arkon",
  description: "Temukan dan terhubung dengan seniman lokal yang berbakat.",
};

export default async function RootLayout({ children }) {
  const supabase = createServerComponentClient({ cookies: cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  useUser.setState({ user: session?.user });

  return (
    <html lang="en" data-theme="light">
      <head>
        <meta name="dicoding:email" content="taufik2017yk@gmail.com" />
      </head>
      <body className={inter.className}>
        <UserInit data={{ user: session?.user }} />
        {children}
      </body>
    </html>
  );
}
