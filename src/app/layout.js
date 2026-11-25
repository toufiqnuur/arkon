import "./globals.css";
import { Inter } from "next/font/google";
import { useUser } from "~/store";
import { UserInit } from "~/store/StoreInit";
import { createClient } from "~/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Arkon",
  description: "Temukan dan terhubung dengan seniman lokal yang berbakat.",
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  useUser.setState({ user });

  return (
    <html lang="en" data-theme="light">
      <head>
        <meta name="dicoding:email" content="taufik2017yk@gmail.com" />
      </head>
      <body className={inter.className}>
        <UserInit data={{ user }} />
        {children}
      </body>
    </html>
  );
}
