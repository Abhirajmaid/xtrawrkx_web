import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import ClientLayout from "@/src/components/layout/ClientLayout";

export default function PrimaryLayout({ children }) {
  return (
    <ClientLayout>
      <Navbar />
      {children}
      <Footer />
    </ClientLayout>
  );
}
