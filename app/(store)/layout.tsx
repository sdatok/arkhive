import { CartProvider } from "@/context/CartContext";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      <main className="pt-11">{children}</main>
      <Footer />
    </CartProvider>
  );
}
