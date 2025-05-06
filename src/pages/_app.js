import { Provider } from "react-redux";
import { store } from "../app/store";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../components/common/ScrollTop";
import Seo from "../components/common/seo";
import "../index.scss";
import InactivityTimer from "../components/inactivity-timer"; // Adjust the path as needed
import Head from "next/head";
import { ModalProvider } from "../context/ModalContext"; // Adjust path if needed

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head></Head>
      <InactivityTimer
        timeoutDuration={600000} // 10 minutes
        warningDuration={30000} // 30 seconds
        excludedPaths={[
          "/login",
          "/register",
          "/",
          "/sign-up",
          "/about-us",
          "/how-we-work",
          "/events",
          "/contact",
          "/broker-user-guide",
          "/appraiser-user-guide",
          "/brokerage-company-user-guide",
          "/appraiser-company-user-guide",
          "/appraiser",
          "/mortgage-broker",
          "/appraiser-company",
          "/mortgage-brokerage",
          "/terms",
          "/faq",
        ]} // Excluded pages
      />
      <Seo
        font={
          "https://fonts.googleapis.com/css?family=Nunito:400,400i,500,600,700&display=swap"
        }
      />
      <Provider store={store}>
        <Toaster />
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </Provider>

      <ScrollToTop />
    </>
  );
}

export default MyApp;
