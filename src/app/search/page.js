/* eslint-disable react/no-unescaped-entities */
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CardItem from "~/components/CardItem";

const SearchNotFound = () => {
  return (
    <div className="md:flex md:items-center">
      <Image
        src="/not-found.jpeg"
        width={400}
        height={400}
        alt="Ilustrasi halaman tidak ditemukan"
      />
      <div className="mt-8 md:ml-8 md:mt-0">
        <h3 className="text-2xl font-semibold">
          Yah, pencarianmu tidak ditemukan
        </h3>
        <p className="mt-2 text-lg">
          Coba kata kunci lain atau kembali ke beranda.
        </p>
        <Link className="btn btn-primary mt-4" href="/">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q");
  const lokasiParams = searchParams.get("lokasi");
  const supabase = createClientComponentClient();
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (lokasiParams) {
        const { data } = await supabase
          .from("pages")
          .select()
          .textSearch("name", `${keyword}`, {
            type: "websearch",
          })
          .eq("provinsi", lokasiParams);
        setResult(data);
      } else {
        const { data } = await supabase
          .from("pages")
          .select()
          .textSearch("name", `${keyword}`, {
            type: "websearch",
          });
        setResult(data);
      }
      setLoading(false);
    })();
  }, [keyword, lokasiParams]);

  if (!keyword) {
    return <SearchNotFound />;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">
        Menampilkan hasil untuk "{keyword}"
      </h3>
      {result ? (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {result.map((data) => (
            <CardItem
              key={data.id}
              name={data.name}
              poster={data.images?.slides[0]}
              provinsi={data.provinsi}
              tarif={data.tarif}
              kategori={data.kategori}
            />
          ))}
        </div>
      ) : loading ? (
        <span className="loading loading-dots loading-lg"></span>
      ) : (
        <SearchNotFound />
      )}
    </div>
  );
}
