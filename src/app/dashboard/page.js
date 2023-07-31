"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Form from "~/components/dashboard/Form";
import { useUser, useUserPage } from "~/store";

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const { user } = useUser();
  const { data, setData } = useUserPage();
  const [currentData, setCurrentData] = useState(null);

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
      <div className="mt-4 flex items-end gap-4">
        <div className="form-control w-full max-w-xs">
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
        <Form data={data[currentData]} />
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