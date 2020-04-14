import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SelectedFileContext } from "@contexts/SelectedFileContext";
import { SelectedCastContext } from "@contexts/SelectedCast";

const Container =
  BROWSER &&
  dynamic(() => import("../components/Container"), {
    ssr: false,
  });

export default () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCast, setSelectedCast] = useState(null);

  return (
    <SelectedFileContext.Provider
      value={{
        selectedFile,
        setSelectedFile,
      }}
    >
      <SelectedCastContext.Provider value={{ selectedCast, setSelectedCast }}>
        {Container ? <Container /> : <div />}
      </SelectedCastContext.Provider>
    </SelectedFileContext.Provider>
  );
};
