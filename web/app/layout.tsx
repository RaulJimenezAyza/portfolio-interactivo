import type { Metadata, Viewport } from "next";
import "./globals.css";

/* app/icon.svg is picked up by Next's file convention and emitted as the
   <link rel="icon"> — the single-file build carried it as a base64 data URI
   in its <head>, and porting the body and the CSS left it behind. */
const TITLE = "Raúl Jiménez Ayza · La Isla del Gato — portfolio jugable 3D";
const DESC =
  "La Isla del Gato: el portfolio jugable de Raúl Jiménez Ayza. Explora una isla con templos, físicas reales y un gato protagonista.";
const OG_ALT = "La Isla del Gato — el portfolio jugable de Raúl Jiménez Ayza";

export const metadata: Metadata = {
  /* Absolute, because a share card is read by a scraper that has no page to
     resolve a relative path against, and this is the base it resolves from.
     The trailing slash and the bare "og.png" below are both load-bearing:
     "/og.png" against this base resolves to the domain root and 404s, since
     Pages serves the site from a project subpath. */
  metadataBase: new URL("https://rauljimenezayza.github.io/portfolio-interactivo/"),
  title: TITLE,
  description: DESC,
  /* public/og.png, drawn by scripts/og.mjs on every build — see the note
     there for why this is not next/og. */
  openGraph: {
    title: TITLE,
    description: DESC,
    type: "website",
    locale: "es_ES",
    images: [{ url: "og.png", width: 1200, height: 630, alt: OG_ALT }]
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["og.png"] }
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
