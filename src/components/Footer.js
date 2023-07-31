import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-zinc-200">
      <div className="footer mx-auto max-w-screen-xl p-10">
        <div>
          <Link href="/">
            <Logo type="minimal" className="h-12 w-12" />
          </Link>
          <p>
            Arkon - Artis Konektor.
            <br />
            &copy; {new Date().getFullYear()}
          </p>
        </div>
        <div>
          <span className="footer-title">Legal</span>
          <a className="link-hover link">Terms of use</a>
          <a className="link-hover link">Privacy policy</a>
          <a className="link-hover link">Cookie policy</a>
        </div>
      </div>
    </footer>
  );
}
