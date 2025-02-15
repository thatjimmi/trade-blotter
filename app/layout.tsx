import "./globals.css";
import localFont from 'next/font/local';

const cabinetGrotesk = localFont({
  src: '../public/fonts/CabinetGrotesk-Regular.woff',
  variable: '--font-cabinet'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cabinetGrotesk.variable}
      >
        {children}
      </body>
    </html>
  );
}
