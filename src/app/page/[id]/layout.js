import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";

export default function PageLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-screen-xl px-4 py-10">{children}</main>
      <Footer />
    </>
  );
}
