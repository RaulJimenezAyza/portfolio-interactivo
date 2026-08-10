import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raúl Jiménez Ayza · La Isla del Gato — portfolio jugable 3D",
  description:
    "La Isla del Gato: el portfolio jugable de Raúl Jiménez Ayza. Explora una isla con templos, físicas reales y un gato protagonista."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0c"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Errors thrown inside the Canvas subtree never reached a console I
            could read from the automation harness. Parking them on window is
            the cheapest way to get a look at them; harmless to leave in. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.__errs=[];addEventListener('error',e=>window.__errs.push(String(e.message)+' @ '+e.filename+':'+e.lineno));" +
              "addEventListener('unhandledrejection',e=>window.__errs.push('rejection: '+String(e.reason&&e.reason.stack||e.reason)));" +
              "(function(o){console.error=function(){window.__errs.push([...arguments].map(a=>String(a&&a.stack||a)).join(' ').slice(0,600));o.apply(console,arguments)}})(console.error);"
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
