import type { Metadata } from "next";
import {Montserrat} from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets:["latin"],
  variable: "--font-geist-sans",
  weight: ["100","400","500","700","800"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://phantomrideKnust.site"),
  keywords: ['PhantomRide', 'Phantom Ride', 'Phantom Ride Knust', 'PhantomRideKnust', 'phantomride', 'phantomrideknust'],
  title: {default:"Phantom Ride Knust",
          template: `%s | Phantom Ride Knust`
  },
  openGraph: {
    description: "Offering transportation services from home to knust campus and back home.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={montserrat.className}
      >
        {children}
      </body>
    </html>
  );
}
