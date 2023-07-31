"use client";
/* eslint-disable @next/next/no-img-element */
import { RiMapPinFill, RiMoneyDollarCircleFill } from "react-icons/ri";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDataStore, useUser } from "~/store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import clsx from "clsx";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const Maps = dynamic(() => import("~/components/Maps"), { ssr: false });

export default function DetailPage({ params }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [pageData, setPageData] = useState(null);
  const [pageComment, setPageComment] = useState(null);
  const [commentInput, setCommentInput] = useState("");

  const [fetchingData, setFetchingData] = useState(true);
  const [isPostComment, setIsPostComment] = useState(false);

  const { data, updateData } = useDataStore();
  const { user } = useUser();

  useEffect(() => {
    let pageId = atob(params.id);
    pageId = pageId.slice(5, pageId.length);
    const isFound = data && data.filter((item) => item.id == pageId);
    if (isFound.length) {
      setPageData(isFound[0]);
    } else {
      (async () => {
        const { data } = await supabase
          .from("pages")
          .select()
          .eq("id", pageId)
          .single();
        setPageData(data);
        updateData(data);
      })();
    }
    setFetchingData(false);
    (async () => {
      const { data } = await supabase
        .from("comments")
        .select(`*, profiles(*)`)
        .eq("page_id", pageId)
        .order("id", { ascending: false });
      setPageComment(data);
    })();
  }, [params]);

  const handleKirimKomentar = () => {
    let pageId = atob(params.id);
    pageId = pageId.slice(5, pageId.length);
    if (!user) {
      router.push("/auth/signin");
    } else {
      setIsPostComment(true);
      (async () => {
        const { data } = await supabase
          .from("comments")
          .insert({
            user_id: user.id,
            page_id: pageId,
            body: commentInput,
          })
          .select()
          .single();
        pageComment
          ? setPageComment((prev) => [
              { ...data, profiles: user?.user_metadata },
              ...prev,
            ])
          : setPageComment([{ ...data, profiles: user?.user_metadata }]);
      })();
      setCommentInput("");
      setIsPostComment(false);
    }
  };

  if (fetchingData) {
    return <span className="loading loading-dots loading-lg"></span>;
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-y-12 md:grid-cols-8 md:gap-x-8 md:gap-y-10">
        <div className="md:col-span-3">
          <Swiper
            modules={[Autoplay, Navigation, Pagination, A11y]}
            navigation
            loop
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            slidesPerView={1}
            className="aspect-[4/3] rounded"
          >
            {pageData?.images?.slides?.map((url, idx) => (
              <SwiperSlide className="aspect-[4/3] bg-slate-300" key={idx}>
                <img
                  src={url}
                  className="h-full object-cover"
                  loading="lazy"
                  alt=""
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {pageData?.lokasi?.koordinat && (
            <div className="mt-8 hidden aspect-square overflow-hidden rounded md:block">
              <Maps position={pageData?.lokasi?.koordinat?.split(",")} />
            </div>
          )}
        </div>
        <div className="text-sm md:col-span-5 md:text-base">
          <div className="flex space-x-4">
            <div className="h-16 w-16 shrink-0 rounded-full bg-slate-200"></div>
            <div>
              <h2 className="card-title">{pageData?.name}</h2>
              <p className="mt-1">{pageData?.short_desc}</p>
            </div>
          </div>
          <div className="mt-8 inline-flex w-full items-center">
            <div className="ml-2">
              <span className="hidden text-primary md:block">Detail:</span>{" "}
              <span className="text-black">{pageData?.detail || "-"}</span>
            </div>
          </div>
          <div className="mt-8 inline-flex w-full items-center md:mt-2">
            {/* <RiStarFill size={16} className="text-orange-600 md:hidden" />{" "}
            <div className="ml-2">
              <span className="hidden text-primary md:block">Penilaian:</span>{" "}
              <span className="text-black">5.0 (7 penilaian)</span>
            </div>
          </div>
          <div className="mt-2 inline-flex w-full items-center"> */}
            <RiMoneyDollarCircleFill
              size={16}
              className="text-green-600 md:hidden"
            />{" "}
            <div className="ml-2">
              <span className="hidden text-primary md:block">Tarif:</span>{" "}
              <span className="text-black">
                Mulai dari {pageData?.tarif || "-"}
              </span>
            </div>
          </div>
          <div className="mt-2 inline-flex w-full">
            <RiMapPinFill
              size={16}
              className="shrink-0 text-blue-600 md:hidden"
            />{" "}
            <div className="-mt-1 ml-2">
              <span className="hidden text-primary md:block">Lokasi:</span>
              <span className="text-black">{pageData?.lokasi?.full}</span>
            </div>
          </div>
          <div className="mt-6 w-full md:ml-2 md:mt-2">
            <span className="hidden text-primary md:block">Kontak:</span>
            <div className="mt-2 flex flex-wrap gap-3">
              {pageData?.kontak?.map((kontak, idx) => (
                <button className="btn btn-primary btn-sm" key={idx}>
                  {kontak}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold">Ulasan</h3>
            <div className="mt-4">
              {/* <div className="rating rating-lg">
                <input type="radio" name="rating-8" className="rating-hidden" />
                <input
                  type="radio"
                  name="rating-8"
                  className="mask mask-star-2 bg-orange-400"
                />
                <input
                  type="radio"
                  name="rating-8"
                  className="mask mask-star-2 bg-orange-400"
                />
                <input
                  type="radio"
                  name="rating-8"
                  className="mask mask-star-2 bg-orange-400"
                />
                <input
                  type="radio"
                  name="rating-8"
                  className="mask mask-star-2 bg-orange-400"
                />
                <input
                  type="radio"
                  name="rating-8"
                  className="mask mask-star-2 bg-orange-400"
                />
              </div> */}
              <textarea
                className="textarea textarea-bordered mt-4 w-full"
                placeholder="Beri ulasan"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                rows={4}
                disabled={!user}
              ></textarea>
              <button
                className="btn btn-primary mt-2"
                onClick={handleKirimKomentar}
                disabled={isPostComment}
              >
                {isPostComment ? (
                  <>
                    <span class="loading loading-spinner"></span>
                    loading
                  </>
                ) : user ? (
                  "Kirim ulasan"
                ) : (
                  "Masuk untuk komentar"
                )}
              </button>
            </div>

            <div className="mt-8 space-y-2">
              <h5 className="text-lg font-semibold">Terbaru</h5>
              {pageComment?.map((comment) => (
                <div className="chat chat-start" key={comment.id}>
                  <div className="avatar chat-image">
                    <div className="w-10 rounded-full">
                      <img src="/hero-alter.jpeg" alt="" />
                    </div>
                  </div>
                  <div
                    className={clsx(
                      "chat-header",
                      comment.user_id == user?.id && "font-medium text-primary",
                    )}
                  >
                    {comment.user_id == user?.id
                      ? "Anda"
                      : comment.profiles.name}
                  </div>
                  <div
                    style={{ "--n": "130 0% 91%", "--nc": "130 0% 0%" }}
                    className="chat-bubble"
                  >
                    {comment.body}
                  </div>
                  <div className="chat-footer opacity-50">
                    {dayjs(comment.created_at).format("DD MMM YYYY — hh:mm")}
                  </div>
                </div>
              ))}
              <div className="text-zinc-500">
                {!pageComment && "Belum ada ulasan"}
              </div>
            </div>
          </div>
        </div>

        {pageData?.lokasi?.koordinat && (
          <div className="aspect-square overflow-hidden rounded md:col-span-3 md:hidden">
            <Maps position={pageData?.lokasi?.koordinat?.split(",")} />
          </div>
        )}
      </div>
    </>
  );
}
