"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import provinsi from "~/constant/provinsi";
import { useUser } from "~/store/UserProvider";

const getDefaultValues = (data) => ({
  name: data?.name ?? "",
  short_desc: data?.short_desc ?? "",
  tarif: data?.tarif ?? "",
  kategori: (data?.kategori ?? []).join(","),
  detail: data?.detail ?? "",
  kontak: (data?.kontak ?? []).join(","),
  provinsi: data?.provinsi ?? "",
  lokasi: {
    full: data?.lokasi?.full ?? "",
    koordinat: data?.lokasi?.koordinat ?? "",
  },
});

function FieldError({ error }) {
  if (!error) return null;

  return <span className="text-error text-sm">{error.message}</span>;
}

export default function FormRHF({ data, onSave, isLoading }) {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({ defaultValues: getDefaultValues(data) });

  useEffect(() => {
    reset(getDefaultValues(data));
  }, [data, reset]);

  const submitData = (values) => {
    onSave({
      user_id: user?.id,
      name: values.name,
      short_desc: values.short_desc,
      tarif: values.tarif,
      detail: values.detail,
      kontak: values.kontak.split(","),
      lokasi: values.lokasi,
      provinsi: values.provinsi,
      kategori: values.kategori.split(","),
      images: data?.images ?? { icon: null, slides: null },
    });
  };

  return (
    <form
      className="mt-2 w-full max-w-2xl space-y-2 md:mt-6"
      onSubmit={handleSubmit(submitData)}
      noValidate
    >
      <div className="form-control w-full">
        <label className="label" htmlFor="rhf-name">
          <span className="label-text">Nama</span>
        </label>
        <input
          id="rhf-name"
          type="text"
          placeholder="Jathilan X..."
          className={clsx(
            "input input-bordered w-full",
            dirtyFields.name && "input-primary",
            errors.name && "input-error",
          )}
          {...register("name", { required: "Nama wajib diisi." })}
        />
        <FieldError error={errors.name} />
      </div>

      <div className="form-control w-full">
        <label className="label" htmlFor="rhf-short-desc">
          <span className="label-text">Deskripsi singkat</span>
        </label>
        <input
          id="rhf-short-desc"
          type="text"
          placeholder="Group seni pertujukan"
          className={clsx(
            "input input-bordered w-full",
            dirtyFields.short_desc && "input-primary",
            errors.short_desc && "input-error",
          )}
          {...register("short_desc", {
            required: "Deskripsi singkat wajib diisi.",
          })}
        />
        <FieldError error={errors.short_desc} />
      </div>

      <div className="md:flex md:gap-4">
        <div className="form-control w-full">
          <label className="label" htmlFor="rhf-tarif">
            <span className="label-text">Tarif</span>
          </label>
          <label className="input-group">
            <span>Rp</span>
            <input
              id="rhf-tarif"
              type="text"
              placeholder="4.000.000"
              className={clsx(
                "input input-bordered w-full",
                dirtyFields.tarif && "input-primary",
                errors.tarif && "input-error",
              )}
              {...register("tarif", { required: "Tarif wajib diisi." })}
            />
          </label>
          <FieldError error={errors.tarif} />
        </div>
        <div className="form-control mt-2 w-full md:mt-0">
          <label className="label" htmlFor="rhf-kategori">
            <span className="label-text">Kategori</span>
          </label>
          <input
            id="rhf-kategori"
            type="text"
            placeholder="Seni tari..."
            className={clsx(
              "input input-bordered w-full",
              dirtyFields.kategori && "input-primary",
              errors.kategori && "input-error",
            )}
            {...register("kategori", { required: "Kategori wajib diisi." })}
          />
          <FieldError error={errors.kategori} />
          <label className="label">
            <span className="label-text-alt text-zinc-500">
              Contoh: kuda lumping, seni tari
            </span>
          </label>
        </div>
      </div>

      <div className="form-control w-full">
        <label className="label" htmlFor="rhf-detail">
          <span className="label-text">Detail</span>
        </label>
        <textarea
          id="rhf-detail"
          rows={4}
          placeholder="Detail"
          className={clsx(
            "min-h-24 textarea textarea-bordered w-full md:min-h-32",
            dirtyFields.detail && "textarea-primary",
            errors.detail && "textarea-error",
          )}
          {...register("detail")}
        ></textarea>
        <FieldError error={errors.detail} />
      </div>

      <div className="form-control w-full">
        <label className="label" htmlFor="rhf-kontak">
          <span className="label-text">Kontak</span>
        </label>
        <input
          id="rhf-kontak"
          type="text"
          placeholder="wa 08xxxx, telp 088xxx, tel: 08xxxx"
          className={clsx(
            "input input-bordered w-full",
            dirtyFields.kontak && "input-primary",
            errors.kontak && "input-error",
          )}
          {...register("kontak", { required: "Kontak wajib diisi." })}
        />
        <FieldError error={errors.kontak} />
        <label className="label">
          <span className="label-text-alt text-zinc-500">
            Contoh: Wa 08xxxx, Tel 08xxx, Telp 08xxx
          </span>
        </label>
      </div>

      <div>
        <h5 className="text-lg font-semibold">Lokasi</h5>
        <div className="form-control w-full">
          <label className="label" htmlFor="rhf-provinsi">
            <span className="label-text">Provinsi</span>
          </label>
          <select
            id="rhf-provinsi"
            className={clsx(
              "select select-bordered font-semibold",
              dirtyFields.provinsi && "select-primary",
              errors.provinsi && "select-error",
            )}
            {...register("provinsi", { required: "Provinsi wajib dipilih." })}
          >
            <option value="" disabled>
              Pilih provinsi
            </option>
            {provinsi.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <FieldError error={errors.provinsi} />
          <label className="label">
            <span className="label-text-alt text-zinc-500">
              Contoh: Yogyakarta
            </span>
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="rhf-alamat">
            <span className="label-text">Alamat lengkap</span>
          </label>
          <input
            id="rhf-alamat"
            type="text"
            placeholder="Alamat lengkap"
            className={clsx(
              "input input-bordered w-full",
              dirtyFields.lokasi?.full && "input-primary",
              errors.lokasi?.full && "input-error",
            )}
            {...register("lokasi.full", {
              required: "Alamat lengkap wajib diisi.",
            })}
          />
          <FieldError error={errors.lokasi?.full} />
          <label className="label">
            <span className="label-text-alt text-zinc-500">
              Contoh: Jl Street No X, xxxx-xxxx
            </span>
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="rhf-koordinat">
            <span className="label-text">Koordinat (opsional)</span>
          </label>
          <input
            id="rhf-koordinat"
            type="text"
            placeholder="Seni tari..."
            className={clsx(
              "input input-bordered w-full",
              dirtyFields.lokasi?.koordinat && "input-primary",
            )}
            {...register("lokasi.koordinat")}
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
