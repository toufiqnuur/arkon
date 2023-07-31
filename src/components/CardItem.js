/* eslint-disable @next/next/no-img-element */
import { RiMapPinFill, RiMoneyDollarCircleFill } from "react-icons/ri";

export default function CardItem({ name, poster, provinsi, tarif, kategori }) {
  return (
    <div className="card border bg-base-100 shadow-xl">
      <figure className="aspect-video">
        <img
          className="aspect-video h-full object-cover"
          src={poster}
          alt={name}
        />
      </figure>
      <div className="px-4 py-3">
        <h2 className="text-md font-semibold leading-tight">{name}</h2>
        {/* <div className="mt-2 inline-flex w-full items-center">
          <RiStarFill size={16} className="text-orange-600" />{" "}
          <span className="ml-1 block text-sm">5.0 (7)</span>
        </div> */}
        <div className="mt-2 inline-flex w-full items-center">
          <RiMapPinFill size={16} className="text-blue-600" />{" "}
          <span className="ml-1 block text-sm capitalize">{provinsi}</span>
        </div>
        <div className="inline-flex w-full items-center">
          <RiMoneyDollarCircleFill size={16} className="text-green-600" />{" "}
          <span className="ml-1 block text-sm">Mulai dari {tarif || "-"}</span>
        </div>
        <div className="card-actions mt-4 justify-end">
          {kategori?.map((kategori, idx) => (
            <div
              className="badge badge-primary badge-outline capitalize"
              key={idx}
            >
              {kategori}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
