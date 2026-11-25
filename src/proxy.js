import { NextResponse } from "next/server";
import { createClient } from "./lib/supabase/server";

export async function proxy(req) {
  const res = NextResponse.next();
  const supabase = createClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/auth") && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}
