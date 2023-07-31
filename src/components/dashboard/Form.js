"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import provinsi from "~/constant/provinsi";
import { useUser } from "~/store";

export default function Form({ data, onSave, isLoading }) {
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [tarif, setTarif] = useState("");
  const [detail, setDetail] = useState("");
  const [kontak, setKontak] = useState("");
  const [lokasi, setLokasi] = useState({ full: "", koordinat: "" });
  const [kategori, setKategori] = useState("");
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [images, setImages] = useState({ icon: null, slides: null });

  const { user } = useUser();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setShortDesc(data.short_desc);
      setTarif(data.tarif);
      setDetail(data.detail);
      setKontak(data.kontak.join(","));
      setKategori(data.kategori.join(","));
      setLokasi(data.lokasi);
      setSelectedProvinsi(data.provinsi);
      setImages(data.images);
    }
  }, [data]);

  const saveData = (e) => {
    e.preventDefault();
    const model = {
      user_id: user?.id,
      name: name,
      short_desc: shortDesc,
      tarif: tarif,
      detail: detail,
      kontak: kontak.split(","),
      lokasi: lokasi,
      provinsi: selectedProvinsi,
      kategori: kategori.split(","),
      images: images,
    };
    onSave(model);
  };

  return (
    <form
      className="mt-2 w-full max-w-2xl space-y-2 md:mt-6 "
      onSubmit={saveData}
    >
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Nama</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Jathilan X..."
          className={clsx(
            "input input-bordered w-full",
            name !== data?.name && "input-primary",
          )}
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Deskripsi singkat</span>
        </label>
        <input
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          type="text"
          placeholder="Group seni pertujukan"
          className={clsx(
            "input input-bordered w-full",
            shortDesc !== data?.short_desc && "input-primary",
          )}
          required
        />
      </div>

      <div className="md:flex md:gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Tarif</span>
          </label>
          <label className="input-group">
            <span>Rp</span>
            <input
              value={tarif}
              onChange={(e) => setTarif(e.target.value)}
              type="text"
              placeholder="4.000.000"
              className={clsx(
                "input input-bordered w-full",
                tarif !== data?.tarif && "input-primary",
              )}
              required
            />
          </label>
        </div>
        <div className="form-control mt-2 w-full md:mt-0">
          <label className="label">
            <span className="label-text">Kategori</span>
          </label>
          <input
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            type="text"
            placeholder="Seni tari..."
            className={clsx(
              "input input-bordered w-full",
              kategori !== data?.kategori?.join(",") && "input-primary",
            )}
            required
          />
          <label className="label">
            <span className="label-text-alt text-zinc-500">
              Contoh: kuda lumping, seni tari
            </span>
          </label>
        </div>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Detail</span>
        </label>
        <textarea
          value={detail}
          rows={4}
          onChange={(e) => setDetail(e.target.value)}
          className={clsx(
            "min-h-24 md:min-h-32 textarea textarea-bordered w-full",
            detail !== data?.detail && "textarea-primary",
          )}
          placeholder="Detail"
        ></textarea>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Kontak</span>
        </label>
        <input
          value={kontak}
          onChange={(e) => setKontak(e.target.value)}
          type="text"
          placeholder="wa 08xxxx, telp 088xxx, tel: 08xxxx"
          className={clsx(
            "input input-bordered w-full",
            kontak !== data?.kontak?.join(",") && "input-primary",
          )}
          required
        />
        <label className="label">
          <span className="label-text-alt text-zinc-500">
            Contoh: Wa 08xxxx, Tel 08xxx, Telp 08xxx
          </span>
        </label>
      </div>

      <div>
        <h5 className="text-lg font-semibold">Lokasi</h5>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Provinsi</span>
          </label>
          <select
            className={clsx("select select-bordered font-semibold")}
            value={selectedProvinsi}
            onChange={(e) => setSelectedProvinsi(e.target.value)}
          >
            {provinsi.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
          <label className="label">
            <span className="label-text-alt text-zinc-500">
              Contoh: Yogyakarta
            </span>
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Alamat lengkap</span>
          </label>
          <input
            value={lokasi.full}
            onChange={(e) =>
              setLokasi((prev) => ({ ...prev, full: e.target.value }))
            }
            type="text"
            placeholder="Alamat lengkap"
            className={clsx(
              "input input-bordered w-full",
              lokasi?.full !== data?.lokasi?.full && "input-primary",
            )}
            required
          />
          <label className="label">
            <span className="label-text-alt text-zinc-500">
              Contoh: Jl Street No X, xxxx-xxxx
            </span>
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Koordinat (opsional)</span>
          </label>
          <input
            value={lokasi.koordinat}
            onChange={(e) =>
              setLokasi((prev) => ({ ...prev, koordinat: e.target.value }))
            }
            type="text"
            placeholder="Seni tari..."
            className={clsx(
              "input input-bordered w-full",
              lokasi?.koordinat !== data?.lokasi?.koordinat && "input-primary",
            )}
          />
          <label className="label">
            <span className="label-text-alt text-zinc-500">
              Contoh: -7.76xxxx, 110.3xxx
            </span>
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        Simpan
      </button>
    </form>
  );
}
