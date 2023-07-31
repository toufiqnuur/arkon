"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Hero() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [provinsi, setProvinsi] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("provinsi").select();
      setProvinsi(data);
    })();
  }, []);

  const handleSearch = () => {
    if (searchKeyword) {
      const query = new URLSearchParams();
      query.set("q", searchKeyword.trim());
      if (searchLocation) {
        query.set("lokasi", searchLocation.trim());
      }
      router.push(`/search?${query}`);
    } else {
      alert("Kata kunci tidak boleh kosong");
    }
  };

  return (
    <div className="hero relative -mt-16 bg-green-100/80 bg-[url(/hero-alter.jpeg)] pb-16 pt-28 bg-blend-screen">
      <div className="hero-content md:text-center">
        <div className="my-10 md:my-0">
          <div className="flex space-x-4 md:justify-center">
            <div className="h-12 w-12 rounded-xl border border-green-400 bg-white p-2 shadow-lg shadow-green-400">
              <Image
                src="/icon/wayang-1.png"
                width={36}
                height={36}
                alt="wayang"
              />
            </div>
            <div className="h-12 w-12 rounded-xl border border-blue-400 bg-white p-2 shadow-lg shadow-blue-400">
              <Image
                src="/icon/dangdut-1.png"
                width={36}
                height={36}
                alt="wayang"
              />
            </div>
            <div className="h-12 w-12 rounded-xl border border-orange-400 bg-white p-2 shadow-lg shadow-orange-400">
              <Image
                src="/icon/kuda-lumping-1.png"
                width={36}
                height={36}
                alt="wayang"
              />
            </div>
          </div>
          <h1 className="mt-8 text-4xl font-black">
            Temukan seniman di sekitar Anda!
          </h1>
          <p className="pt-2 text-lg font-medium">
            Temukan dan terhubung dengan seniman lokal yang berbakat.
          </p>
        </div>
      </div>
      <div className="absolute inset-x-4 -bottom-24 mx-auto w-auto max-w-4xl rounded-xl bg-white p-2 shadow-md md:-bottom-8 md:flex md:space-x-2">
        <input
          type="text"
          placeholder="Kuda lumping x..."
          className="input input-bordered w-full"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <select
          className="select select-bordered mt-2 w-full md:mt-0 md:max-w-xs"
          onChange={(e) => setSearchLocation(e.target.value)}
          defaultValue={provinsi[0]?.provinsi || "default"}
        >
          <option value="default" disabled>
            Pilih lokasi
          </option>
          {provinsi &&
            provinsi.map(({ provinsi }) => (
              <option value={provinsi} key={provinsi} className="capitalize">
                {provinsi}
              </option>
            ))}
        </select>
        <button
          className="btn btn-primary mt-2 w-full md:mt-0 md:w-auto"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
