import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "SeedOfCode-AI-Course-Generator",
  description:
    "AI Course Generator is a Next.js web app that lets users create and manage personalized coding courses.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* <GoogleOneTap/> */}
        <body className={`${inter.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
