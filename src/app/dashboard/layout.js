import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";

export default function Dashboard({ children }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">{children}</main>
      <Footer />
    </>
  );
}
