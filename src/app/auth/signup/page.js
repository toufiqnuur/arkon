"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "~/components/Logo";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          name: name,
        },
      },
    });
    alert("Email verification telah terkirim");
    setLoading(false);
    router.push("/auth/signin");
  };

  return (
    <div className="mx-auto max-w-lg px-4">
      <form
        className="mt-10 border px-4 pb-8 pt-6 shadow-lg"
        onSubmit={handleSignUp}
      >
        <div className="text-center">
          <Link href="/" className="btn btn-ghost">
            <Logo type="full" className="mx-auto text-primary" />
          </Link>
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Nama</span>
          </label>
          <input
            type="text"
            placeholder="Joko Tingkir"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-control mt-2">
          <label className="label">
            <span className="label-text">Email Address</span>
          </label>
          <input
            type="email"
            placeholder="email@domain.com"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={loading}
        >
          Daftar
        </button>

        <div className="mt-6">
          Sudah punya akun?{" "}
          <Link href="/auth/signin" className="font-semibold text-primary">
            Masuk
          </Link>
        </div>
      </form>
    </div>
  );
}
