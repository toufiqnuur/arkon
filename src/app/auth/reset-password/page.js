"use client";

import { createClient } from "~/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "~/components/Logo";
import { toast } from "~/store/toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      setHasSession(Boolean(user));
      setChecking(false);
    };

    checkSession();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(
        error.message.toLowerCase().includes("session")
          ? "Tautan reset tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru."
          : error.message,
      );
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    toast.success("Kata sandi berhasil diperbarui.");
    setSuccess(true);
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="mx-auto mt-10 max-w-lg px-4">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="mx-auto max-w-lg px-4">
        <div className="mt-10 rounded-lg px-4 pt-6 pb-8 text-center shadow-lg">
          <Link href="/" className="btn btn-ghost">
            <Logo type="full" className="text-primary mx-auto" />
          </Link>

          <h1 className="mt-4 text-xl font-bold">Tautan Tidak Valid</h1>
          <p className="mt-2 text-sm">
            Tautan reset kata sandi tidak valid atau sudah kedaluwarsa.
          </p>

          <Link
            href="/auth/forget-password"
            className="btn btn-primary mt-6 w-full"
          >
            Minta Tautan Baru
          </Link>
          <Link
            href="/auth/signin"
            className="link link-hover text-primary mt-4 inline-block text-sm"
          >
            Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4">
        <div className="mt-10 rounded-lg px-4 pt-6 pb-8 text-center shadow-lg">
          <Link href="/" className="btn btn-ghost">
            <Logo type="full" className="text-primary mx-auto" />
          </Link>

          <h1 className="mt-4 text-xl font-bold">
            Kata Sandi Berhasil Diperbarui
          </h1>
          <p className="mt-2 text-sm">
            Silakan masuk kembali menggunakan kata sandi baru Anda.
          </p>

          <Link href="/auth/signin" className="btn btn-primary mt-6 w-full">
            Masuk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4">
      <form
        className="mt-10 rounded-lg px-4 pt-6 pb-8 shadow-lg"
        onSubmit={handleReset}
      >
        <div className="text-center">
          <Link href="/" className="btn btn-ghost">
            <Logo type="full" className="text-primary mx-auto" />
          </Link>
        </div>

        <h1 className="mt-4 text-center text-xl font-bold">
          Atur Kata Sandi Baru
        </h1>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Kata Sandi Baru</span>
          </label>
          <input
            type="password"
            placeholder="******"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="form-control mt-2">
          <label className="label">
            <span className="label-text">Ulangi Kata Sandi Baru</span>
          </label>
          <input
            type="password"
            placeholder="******"
            className="input input-bordered w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {error && (
          <div role="alert" className="alert alert-error mt-4 text-sm">
            {error}
          </div>
        )}

        {false && (
          <div role="alert" className="alert alert-error mt-4 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Kata Sandi"}
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
