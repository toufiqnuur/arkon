"use client";

import { createClient } from "~/lib/supabase/client";
import { uploadImage } from "~/lib/storage";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// Old controlled-form implementation (kept for rollback)
// import Form from "~/components/dashboard/Form";
import Form from "~/components/dashboard/FormRHF";
import InputImage from "~/components/dashboard/InputImage";
import { useUser } from "~/store/UserProvider";
import { useUserPage } from "~/store";
import { toast } from "~/store/toast";

export default function Dashboard() {
  const supabase = createClient();
  const { user } = useUser();
  const { data, setData } = useUserPage();
  const [currentData, setCurrentData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);

  useEffect(() => {
    if (!user) {
      setFetching(false);
      return;
    }

    let active = true;
    setFetching(true);
    setData(null);
    setCurrentData(null);

    (async () => {
      const { data: pages, error: fetchError } = await supabase
        .from("pages")
        .select()
        .eq("user_id", user.id);

      if (!active) return;

      if (fetchError) {
        toast.error(`Gagal memuat halaman: ${fetchError.message}`);
      } else {
        setData(pages);
        setCurrentData(pages.length ? 0 : null);
      }

      setFetching(false);
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleUpdate = async (model) => {
    const current = data?.[currentData];
    if (!current) return;

    setLoading(true);

    try {
      const payload = {
        ...model,
        images: { ...(model.images ?? current.images ?? {}) },
      };

      if (selectedLogo) {
        payload.images.logo = await uploadImage(supabase, selectedLogo);
      }

      if (selectedImages?.length) {
        payload.images.slides = await Promise.all(
          selectedImages.map((file) => uploadImage(supabase, file)),
        );
      }

      const { data: res, error: updateError } = await supabase
        .from("pages")
        .update(payload)
        .eq("id", current.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setData(data.map((item) => (item.id === res.id ? res : item)));
      setSelectedLogo(null);
      setSelectedImages(null);
      toast.success("Halaman berhasil diperbarui.");
    } catch (err) {
      toast.error(err?.message ?? "Gagal menyimpan halaman.");
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
            onChange={(e) => {
              setCurrentData(Number(e.target.value));
              setSelectedLogo(null);
              setSelectedImages(null);
            }}
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

      {fetching ? (
        <div className="py-16 text-center">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : data?.length ? (
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <Form
            data={data[currentData]}
            onSave={(model) => handleUpdate(model)}
            isLoading={loading}
          />
          <InputImage
            key={currentData ?? "none"}
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
