import React from "react";
import dynamic from "next/dynamic";

const Container =
  BROWSER &&
  dynamic(() => import("../components/Settings"), {
    ssr: false,
  });

export default () => {
  return Container ? <Container /> : <div />;
};
