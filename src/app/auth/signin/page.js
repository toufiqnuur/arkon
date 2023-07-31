"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "~/components/Logo";
import { useUser } from "~/store";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useUser();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setUser(user);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-lg px-4">
      <form
        className="mt-10 border px-4 pb-8 pt-6 shadow-lg"
        onSubmit={handleSignIn}
      >
        <div className="text-center">
          <Link href="/" className="btn btn-ghost">
            <Logo type="full" className="mx-auto text-primary" />
          </Link>
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Email Address</span>
          </label>
          <input
            type="email"
            placeholder="email@domain.com"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-control mt-2">
          <label className="label">
            <span className="label-text">Kata Sandi</span>
          </label>
          <input
            type="password"
            placeholder="******"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={loading}
        >
          Masuk
        </button>

        <div className="mt-6">
          Belum punya akun?{" "}
          <Link href="/auth/signup" className="font-semibold text-primary">
            Daftar
          </Link>
        </div>
      </form>
    </div>
  );
}
