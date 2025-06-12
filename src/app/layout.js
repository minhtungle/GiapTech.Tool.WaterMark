import { Inter } from "next/font/google";
import "./globals.css";

import 'bootstrap/dist/css/bootstrap.min.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tạo ảnh bản quyền",
  description: "VIETGEN Education - Tạo ảnh bản quyền với watermark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
