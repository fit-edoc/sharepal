import "./globals.css";
import Navbar from "@/components/common/Navbar";
import StoreProvider from "@/store/StoreProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import BottomNav from "@/components/navigation/BottomNav";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import RentalDateModal from "@/components/common/RentalDateModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="pb-16 lg:pb-0">  
        <StoreProvider>
          <Navbar />
          <main>{children}</main>
          <RentalDateModal />
          <CartDrawer />
          <FloatingCartBar />
          <BottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}