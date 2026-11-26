/* eslint-disable react/no-unescaped-entities */
"use client";

import { createClient } from "~/lib/supabase/client";
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

const SearchLoading = () => {
  return (
    <div className="py-16 text-center">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q");
  const lokasiParams = searchParams.get("lokasi");
  const supabase = createClient();
  const queryKey = `${keyword ?? ""}::${lokasiParams ?? ""}`;
  const [search, setSearch] = useState({ key: null, data: null, error: null });
  const loading = search.key !== queryKey;

  useEffect(() => {
    if (!keyword) return;

    let active = true;

    (async () => {
      try {
        let query = supabase
          .from("pages")
          .select()
          .textSearch("name", keyword, {
            type: "websearch",
          });

        if (lokasiParams) query = query.eq("provinsi", lokasiParams);

        const { data, error } = await query;

        if (!active) return;

        setSearch({ key: queryKey, data: data ?? [], error });
      } catch (err) {
        if (!active) return;

        setSearch({ key: queryKey, data: [], error: err });
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, keyword, lokasiParams]);

  if (!keyword) {
    return <SearchNotFound />;
  }

  if (loading) {
    return <SearchLoading />;
  }

  if (search.error || !search.data?.length) {
    return <SearchNotFound />;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">
        Menampilkan hasil untuk "{keyword}"
      </h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {search.data.map((data) => (
          <Link
            href={`/page/${data.id}`}
            key={data.id}
            className="hover:contrast-50 active:scale-95"
          >
            <CardItem
              name={data.name}
              poster={data.images?.slides?.[0]}
              provinsi={data.provinsi}
              tarif={data.tarif}
              kategori={data.kategori}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
