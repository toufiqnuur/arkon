"use client";

import clsx from "clsx";
import { useToastStore } from "~/store/toast";

const alertClasses = {
  success: "alert-success",
  error: "alert-error",
  info: "alert-info",
};

export default function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const remove = useToastStore((state) => state.remove);

  return (
    <div
      className="toast toast-end toast-bottom z-[200]"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={clsx(
            "alert text-sm shadow-lg",
            alertClasses[toast.type] ?? alertClasses.info,
          )}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => remove(toast.id)}
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
