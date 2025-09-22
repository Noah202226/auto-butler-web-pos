"use client";

import "./globals.css";
import { useInitTheme } from "./components/layout/ThemeProvider";

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  useInitTheme();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-base-content transition-colors duration-300">
        {/* <Header /> */}

        <main className="">{children}</main>

        {/* Background Logo */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
          style={{
            backgroundImage: "url('/logo.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "400px",
          }}
        ></div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "8px",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}
