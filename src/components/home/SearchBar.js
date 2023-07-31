"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const query = new URLSearchParams();
      query.set("q", searchKeyword.trim());
      router.push(`/search?${query}`);
    }
  };
  return (
    <div className="ml-2 flex-1 md:ml-0">
      <input
        type="text"
        placeholder="Search here"
        className="input input-bordered mx-auto w-full max-w-lg"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
