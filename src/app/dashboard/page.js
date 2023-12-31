"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Form from "~/components/dashboard/Form";
import InputImage from "~/components/dashboard/InputImage";
import { useUser, useUserPage } from "~/store";

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const { user } = useUser();
  const { data, setData, updateData } = useUserPage();
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("pages")
        .select()
        .eq("user_id", user.id);
      if (data) {
        setData(data);
        setCurrentData(0);
      }
    })();
  }, []);

  const handleUpdate = async (model) => {
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
      .eq("id", data[currentData].id)
      .select()
      .single();
    let index = data.findIndex((item) => item.id == data[currentData].id);
    let newData = data;
    data[index] = res;
    setData(newData);
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
              currentData && "text-primary",
            )}
            value={currentData}
            onChange={(e) => setCurrentData(e.target.value)}
          >
            <option disabled>Pilih halaman</option>
            {data &&
              data.map((data, idx) => (
                <option key={data.id} value={idx}>
                  {data.name}
                </option>
              ))}
          </select>
        </div>
        <Link href="/dashboard/new" className="btn btn-primary">
          Buat halaman
        </Link>
      </div>

      {data ? (
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
        <div className="hidden py-16 text-center">
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
