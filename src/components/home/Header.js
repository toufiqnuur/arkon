import Link from "next/link";
import Logo from "../Logo";
import HeaderMenu from "./HeaderMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-[100] bg-white/10 backdrop-blur-lg">
      <div className="navbar relative mx-auto flex max-w-screen-xl">
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl normal-case" href="/">
            <Logo type="full" />
          </Link>
        </div>
        <HeaderMenu />
      </div>
    </header>
  );
}
