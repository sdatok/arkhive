import { CartProvider } from "@/context/CartContext";
import StoreShell from "@/components/store/StoreShell";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <StoreShell>{children}</StoreShell>
    </CartProvider>
  );
}
