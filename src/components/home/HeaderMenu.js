"use client";

import { Menu } from "@headlessui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiUserAddLine,
  RiUserSharedLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
import { useUser } from "~/store";

const BtnLink = ({ className, href, children }) => {
  return (
    <Link className={clsx("btn normal-case", className)} href={href}>
      {children}
    </Link>
  );
};

export default function HeaderMenu() {
  const supabase = createClientComponentClient();
  const { user, setUser } = useUser();
  const path = usePathname();

  const logout = async() => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!user && path === "/") {
    return (
      <div className="flex items-center space-x-2">
        <BtnLink className="text-lg" href="/auth/signin">
          Masuk
        </BtnLink>
        <BtnLink className="btn-neutral text-lg" href="/auth/signup">
          Daftar
        </BtnLink>
      </div>
    );
  }

  return (
    <Menu>
      <Menu.Button className="avatar relative ml-4 mr-2">
        <div className="h-8 w-8 rounded-full bg-white ring ring-offset-2 ring-offset-base-100">
          {user ? (
            <span className="text-xl">{user.user_metadata.name[0]}</span>
          ) : (
            <RiUserUnfollowLine
              className="mx-auto mt-1 text-zinc-600"
              size={24}
            />
          )}
        </div>
      </Menu.Button>
      <Menu.Items className="min-w-48 menu absolute right-4 top-16 rounded-lg bg-white shadow-lg">
        {user ? (
          <>
            <Menu.Item
              as="li"
              className="menu-title w-full px-2 text-left text-zinc-500"
            >
              <span>Akun</span>
              <div className="mt-1 flex flex-wrap space-y-1 font-normal">
                <span className="block w-full">{user.user_metadata.name}</span>
                <span className="block w-full text-xs text-zinc-400">
                  {user.email}
                </span>
              </div>
            </Menu.Item>
            <Menu.Item as="li" className="mt-2 w-full text-left">
              <BtnLink className="btn-primary btn-sm" href="/dashboard">
                Dashboard
              </BtnLink>
            </Menu.Item>
            <Menu.Item as="li" className="mt-2 w-full text-left">
              <button
                className="btn btn-error btn-sm normal-case"
                onClick={logout}
              >
                Keluar
              </button>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item as="li" className="w-full text-left">
              <Link href="/auth/signin">
                <RiUserAddLine className="text-primary" />
                Daftar
              </Link>
            </Menu.Item>
            <Menu.Item as="li" className="w-full text-left">
              <Link href="/auth/signup">
                <RiUserSharedLine className="text-primary" />
                Masuk
              </Link>
            </Menu.Item>
          </>
        )}
      </Menu.Items>
    </Menu>
  );
}
