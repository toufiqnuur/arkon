"use client";

import { createClient } from "~/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "~/components/Logo";
import { useUser } from "~/store/UserProvider";
import { toast } from "~/store/toast";

const MIN_PASSWORD_LENGTH = 6;

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useUser();
  const supabase = createClient();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!name || !trimmedEmail || !password) return;

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error("Kata sandi minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          name: name,
        },
      },
    });

    if (error) {
      if (
        error.message.toLowerCase().includes("already registered") ||
        error.message.toLowerCase().includes("already exists")
      ) {
        toast.error("Email sudah terdaftar. Silakan masuk.");
      } else {
        toast.error(error.message);
      }
      setLoading(false);
      return;
    }

    if (data.session) {
      // Email confirmation is disabled: the user is signed in right away.
      setUser(data.session.user);
      toast.success("Pendaftaran berhasil.");
      setLoading(false);
      router.push("/");
      return;
    }

    // Email confirmation is enabled: wait for the verification link.
    toast.success(
      "Pendaftaran berhasil! Silakan cek email untuk verifikasi sebelum masuk.",
    );
    setLoading(false);
    router.push("/auth/signin");
  };

  return (
    <div className="mx-auto max-w-lg px-4">
      <form
        className="mt-10 rounded-lg px-4 pt-6 pb-8 shadow-lg"
        onSubmit={handleSignUp}
      >
        <div className="text-center">
          <Link href="/" className="btn btn-ghost">
            <Logo type="full" className="text-primary mx-auto" />
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
            autoComplete="name"
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
            autoComplete="email"
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
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </div>

        <div className="form-control mt-2">
          <label className="label">
            <span className="label-text">Ulangi Kata Sandi</span>
          </label>
          <input
            type="password"
            placeholder="******"
            className="input input-bordered w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={loading}
        >
          {loading ? "Mendaftaran..." : "Daftar"}
        </button>

        <div className="mt-6">
          Sudah punya akun?{" "}
          <Link href="/auth/signin" className="text-primary font-semibold">
            Masuk
          </Link>
        </div>
      </form>
    </div>
  );
}
