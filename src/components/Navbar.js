import Link from "next/link";
import Logo from "./Logo";
import SearchBar from "./home/SearchBar";
import HeaderMenu from "./home/HeaderMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-[100] bg-primary backdrop-blur-lg">
      <div className="navbar relative mx-auto flex max-w-screen-xl">
        <div className="hidden md:block">
          <Link className="btn btn-ghost text-white" href="/">
            <Logo type="full" />
          </Link>
        </div>
        <SearchBar />
        <HeaderMenu />
      </div>
    </header>
  );
}
