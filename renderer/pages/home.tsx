import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SelectedFileContext } from "@contexts/SelectedFileContext";

const Container =
  BROWSER &&
  dynamic(() => import("../components/Container"), {
    ssr: false,
  });

export default () => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <SelectedFileContext.Provider
      value={{
        selectedFile,
        setSelectedFile,
      }}
    >
      {Container ? <Container /> : <div />}
    </SelectedFileContext.Provider>
  );
};
