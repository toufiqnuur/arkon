import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

function copyResponseState(source, target) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }

  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = source.headers.get(header);
    if (value) target.headers.set(header, value);
  }

  return target;
}

export async function proxy(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );

          if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
              if (value) response.headers.set(key, value);
            });
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    return copyResponseState(
      response,
      NextResponse.redirect(new URL("/auth/signin", request.url)),
    );
  }

  const pathname = request.nextUrl.pathname;
  const isRecoveryRoute =
    pathname === "/auth/callback" || pathname === "/auth/reset-password";

  if (pathname.startsWith("/auth") && user && !isRecoveryRoute) {
    return copyResponseState(
      response,
      NextResponse.redirect(new URL("/", request.url)),
    );
  }

  return response;
}
