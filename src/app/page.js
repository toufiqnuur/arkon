import Link from "next/link";
import CardItem from "~/components/CardItem";
import Footer from "~/components/Footer";
import Header from "~/components/home/Header";
import Hero from "~/components/home/Hero";
import { useDataStore } from "~/store";
import { DataInit } from "~/store/StoreInit";
import { createClient } from "~/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select()
    .range(0, 10)
    .order("id", { ascending: false });
  useDataStore.setState({ data });

  return (
    <>
      <DataInit data={data} />
      <Header />
      <Hero />
      <div className="mx-auto mt-32 mb-10 max-w-screen-xl px-4 md:mt-20">
        <h3 className="text-xl font-bold">Baru bergabung</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {data.map((item) => (
            <Link
              href={`/page/${item.id}`}
              key={item.id}
              className="hover:contrast-50 active:scale-95"
            >
              <CardItem
                name={item.name}
                poster={item.images?.slides[0]}
                provinsi={item.provinsi}
                tarif={item.tarif}
                kategori={item.kategori}
              />
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
