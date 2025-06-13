import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react"; // Use `react`, not `next` in Pages Router

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
