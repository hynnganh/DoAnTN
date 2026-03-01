import '@/app/ui/global.css';
import TopBanner from './(client)/components/TopBanner';
import TopMenu from './(client)/components/TopMenu';
import Navbar from './(client)/components/Navbar';
import Footer from './(client)/components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col">

        {/* Banner quảng cáo */}
        <TopBanner />

        {/* Menu nhỏ phía trên */}
        <TopMenu />

        {/* Navbar chính */}
        <Navbar />

        {/* Nội dung từng trang */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <Footer />

      </body>
    </html>
  );
}