import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Outfit({ subsets: ["latin"] });

// export const metadata = {
//   title: "SeedOfCode-AI-Course-Generator",
//   description:
//     "AI Course Generator is a Next.js web app that lets users create and manage personalized coding courses.",

// };

export const metadata = {
  short_name: "SeedOfCode",
  name: "SeedOfCode AI Course Generator",
  description:
    "AI Course Generator is a Next.js web app that lets users create and manage personalized coding courses.",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#000000",
  icons: [
    {
      src: "/seedofcode_icon.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/seedofcode_icon.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* <GoogleOneTap/> */}
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <meta name="apple-mobile-web-app-title" content="SeedOfCode" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="SeedOfCode" />
        </head>

        <body className={`${inter.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}



// default

// import {Inter, Outfit} from "next/font/google"
// import "./globals.css";
// import { ClerkProvider} from "@clerk/nextjs";

// const inter = Outfit({subsets:["latin"]})

// export const metadata = {
//   title: "SeedOfCode-AI-Course-Generator",
//   description: "AI Course Generator is a Next.js web app that lets users create and manage personalized coding courses.",
// };

// export default function RootLayout({ children }) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         {/* <GoogleOneTap/> */}
//         <body
//           className={`${inter.className}`}
//         >
//           {children}
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }
