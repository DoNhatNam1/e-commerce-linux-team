import type { Metadata } from "next";
import { Recursive } from "next/font/google";

import { constructMetadata, SonnerToaster } from "@e-com-linux-team/shadcn";

import Providers from "../components/Providers";
import "./global.css";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={recursive.className}>
        {/* <Navbar /> */}

        <main className="grainy-light flex min-h-[calc(100vh-3.5rem-1px)] flex-col">
          <div className="flex h-full flex-1 flex-col">
            <Providers>{children}</Providers>
          </div>
          {/* <Footer /> */}
        </main>

        <SonnerToaster />
      </body>
    </html>
  );
}
