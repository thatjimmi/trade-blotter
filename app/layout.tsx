import "./globals.css";
import localFont from 'next/font/local';

const cabinetGrotesk = localFont({
  src: [
    {
      path: '../public/fonts/CabinetGrotesk-Thin.woff',
      weight: '100'
    },
    {
      path: '../public/fonts/CabinetGrotesk-ExtraLight.woff',
      weight: '200'
    },
    {
      path: '../public/fonts/CabinetGrotesk-Light.woff',
      weight: '300'
    },
    {
      path: '../public/fonts/CabinetGrotesk-Regular.woff',
      weight: '400'
    },
    {
      path: '../public/fonts/CabinetGrotesk-Medium.woff',
      weight: '500'
    },
    {
      path: '../public/fonts/CabinetGrotesk-Bold.woff',
      weight: '700'
    },
    {
      path: '../public/fonts/CabinetGrotesk-ExtraBold.woff',
      weight: '800'
    },
    {
      path: '../public/fonts/CabinetGrotesk-Black.woff',
      weight: '900'
    }
  ],
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
