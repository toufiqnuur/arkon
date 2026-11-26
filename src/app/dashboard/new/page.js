"use client";

import { createClient } from "~/lib/supabase/client";
import { uploadImage } from "~/lib/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Old controlled-form implementation (kept for rollback)
// import Form from "~/components/dashboard/Form";
import Form from "~/components/dashboard/FormRHF";
import InputImage from "~/components/dashboard/InputImage";
import { useUserPage } from "~/store";

export default function AddNew() {
  const router = useRouter();
  const supabase = createClient();
  const { updateData } = useUserPage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);

  const handleSave = async (model) => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...model,
        images: { ...(model.images ?? { icon: null, slides: null }) },
      };

      if (selectedLogo) {
        payload.images.logo = await uploadImage(supabase, selectedLogo);
      }

      if (selectedImages?.length) {
        payload.images.slides = await Promise.all(
          selectedImages.map((file) => uploadImage(supabase, file)),
        );
      }

      const { data, error: insertError } = await supabase
        .from("pages")
        .insert(payload)
        .select()
        .single();

      if (insertError) throw insertError;

      updateData(data);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.message ?? "Gagal menyimpan halaman.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/dashboard/new">Buat Halaman</Link>
          </li>
        </ul>
      </div>
      {error && (
        <div role="alert" className="alert alert-error mb-4 text-sm">
          {error}
        </div>
      )}
      <div className="flex flex-col-reverse gap-4 md:flex-row">
        <Form onSave={(model) => handleSave(model)} isLoading={loading} />
        <InputImage
          onAvatarChange={(fileObj) => setSelectedLogo(fileObj)}
          onImagesChange={(fileObj) => setSelectedImages(fileObj)}
        />
      </div>
    </>
  );
}
