import Navbar from "./components/navbar";
//import "./globals.css";
import "./styles.css";

export const metadata = {
  headers: {
    "Cache-Control": "no-store, must-revalidate",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
