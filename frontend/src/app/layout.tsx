import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Multi-Modal AI Assistant",
  description:
    "AI-powered platform for image, video, audio, and document intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
