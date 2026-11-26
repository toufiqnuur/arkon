"use client";

import { createClient } from "~/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";
import Logo from "~/components/Logo";
import { toast } from "~/store/toast";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "Jika email terdaftar, tautan untuk mengatur ulang kata sandi telah dikirim.",
      );
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-lg px-4">
      <form
        className="mt-10 rounded-lg px-4 pt-6 pb-8 shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="text-center">
          <Link href="/" className="btn btn-ghost">
            <Logo type="full" className="text-primary mx-auto" />
          </Link>
        </div>

        <h1 className="mt-4 text-center text-xl font-bold">Lupa Kata Sandi</h1>
        <p className="mt-2 text-center text-sm">
          Masukkan email akun Anda untuk menerima tautan reset kata sandi.
        </p>

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
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Kirim Tautan Reset"}
        </button>

        <div className="mt-6 text-center">
          <Link
            href="/auth/signin"
            className="link link-hover text-primary text-sm"
          >
            Kembali ke halaman masuk
          </Link>
        </div>
      </form>
    </div>
  );
}
