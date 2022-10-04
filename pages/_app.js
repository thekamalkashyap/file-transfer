import "../styles/globals.css";
import Head from "next/head";
import Header from "../components/Header";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>LeinDein</title>
        <link rel="icon" type="image/png" href="/ghost.png" />
      </Head>
      <Header />
      <div className="h-[calc(100vh-4rem)] relative w-screen">
        <Component {...pageProps} />
      </div>
    </>
  );
}
export default App;
