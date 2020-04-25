// pages/_app.js
import "../styles/main.scss";
import ReactGA from "react-ga";
import React, { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    ReactGA.initialize("UA-60624235-4");
  }, []);

  return <Component {...pageProps} />;
}
