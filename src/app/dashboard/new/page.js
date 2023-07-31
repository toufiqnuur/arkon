"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Form from "~/components/dashboard/Form";
import InputImage from "~/components/dashboard/InputImage";
import { useUser, useUserPage } from "~/store";

export default function AddNew() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { updateData } = useUserPage();
  const [loading, setLoading] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);

  const handleSave = async (model) => {
    setLoading(true);
    const payload = model;
    if (selectedLogo) {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`${btoa(payload?.id)}-${+new Date()}`, selectedLogo, {
          cacheControl: "3600",
          upsert: false,
        });
      if (!error)
        payload.images.logo = `https://darswxlsordzgcemxqkt.supabase.co/storage/v1/object/public/images/${data.path}`;
    }
    if (selectedImages) {
      const urls = [];
      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        const { data, error } = await supabase.storage
          .from("images")
          .upload(`${btoa(payload?.id)}-${+new Date()}`, file, {
            cacheControl: "3600",
            upsert: false,
          });
        if (!error) {
          urls.push(
            `https://darswxlsordzgcemxqkt.supabase.co/storage/v1/object/public/images/${data.path}`,
          );
        }
      }
      if (urls.length) payload.images.slides = urls;
    }
    const { data } = await supabase
      .from("pages")
      .insert(payload)
      .select()
      .single();
    updateData(data);
    setLoading(false);
    router.push("/dashboard");
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
