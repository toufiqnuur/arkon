"use client";

import { createClient } from "~/lib/supabase/client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Form from "~/components/dashboard/Form";
import InputImage from "~/components/dashboard/InputImage";
import { useUser } from "~/store/UserProvider";
import { useUserPage } from "~/store";

export default function Dashboard() {
  const supabase = createClient();
  const { user } = useUser();
  const { data, setData } = useUserPage();
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data: pages, error } = await supabase
        .from("pages")
        .select()
        .eq("user_id", user.id);

      if (error) return;

      setData(pages);
      setCurrentData(pages.length ? 0 : null);
    })();
  }, [user]);

  const handleUpdate = async (model) => {
    const current = data?.[currentData];
    if (!current) return;

    setLoading(true);
    const payload = model;
    if (selectedLogo) {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`${btoa(user?.id)}-${+new Date()}`, selectedLogo, {
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
    const { data: res } = await supabase
      .from("pages")
      .update(payload)
      .eq("id", current.id)
      .select()
      .single();
    if (res) {
      setData(data.map((item) => (item.id === res.id ? res : item)));
    }
    setSelectedLogo(null);
    setSelectedImages(null);
    setLoading(false);
  };

  return (
    <>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="form-control w-full md:max-w-xs">
          <label className="label">
            <span className="label-text font-semibold">Pilih halaman</span>
          </label>
          <select
            className={clsx(
              "select select-bordered font-semibold",
              currentData !== null && "text-primary",
            )}
            value={currentData ?? ""}
            onChange={(e) => setCurrentData(Number(e.target.value))}
          >
            <option value="" disabled>
              Pilih halaman
            </option>
            {data?.map((page, idx) => (
              <option key={page.id} value={idx}>
                {page.name}
              </option>
            ))}
          </select>
        </div>
        <Link href="/dashboard/new" className="btn btn-primary">
          Buat halaman
        </Link>
      </div>

      {data?.length ? (
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <Form
            data={data[currentData]}
            onSave={(model) => handleUpdate(model)}
            isLoading={loading}
          />
          <InputImage
            previewLogo={data[currentData]?.images?.logo}
            previewImages={data[currentData]?.images?.slides}
            onAvatarChange={(fileObj) => setSelectedLogo(fileObj)}
            onImagesChange={(fileObj) => setSelectedImages(fileObj)}
          />
        </div>
      ) : (
        <div className="py-16 text-center">
          <Image
            src="/empty.jpeg"
            width={250}
            height={250}
            className="mx-auto"
            alt=""
          />
          <h3 className="mt-2 text-xl font-semibold">
            Anda belum menambahkan halaman
          </h3>
        </div>
      )}
    </>
  );
}
