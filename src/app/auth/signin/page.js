"use client";

import { createClient } from "~/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "~/components/Logo";
import { useUser } from "~/store/UserProvider";
import { toast } from "~/store/toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useUser();
  const supabase = createClient();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setUser(user);
    toast.success("Berhasil masuk.");
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-lg px-4">
      <form
        className="mt-10 rounded-lg px-4 pt-6 pb-8 shadow-lg"
        onSubmit={handleSignIn}
      >
        <div className="text-center">
          <Link href="/" className="btn btn-ghost">
            <Logo type="full" className="text-primary mx-auto" />
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

        <div className="mt-2 text-right">
          <Link
            href="/auth/forget-password"
            className="link link-hover text-primary text-sm"
          >
            Lupa kata sandi?
          </Link>
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
          <Link href="/auth/signup" className="text-primary font-semibold">
            Daftar
          </Link>
        </div>
      </form>
    </div>
  );
}
