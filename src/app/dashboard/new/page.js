"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Form from "~/components/dashboard/Form";
import { useUserPage } from "~/store";

export default function AddNew() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { updateData } = useUserPage();
  const [loading, setLoading] = useState(false);

  const handleSave = async (model) => {
    setLoading(true);
    const { data } = await supabase
      .from("pages")
      .insert(model)
      .select()
      .single();
    updateData(data);
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/dashboard/new">Buat Halaman</Link>
          </li>
        </ul>
      </div>
      <Form onSave={(model) => handleSave(model)} isLoading={loading} />
    </>
  );
}
