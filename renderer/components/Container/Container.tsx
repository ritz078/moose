import { Header, IResults } from "../Header";
import React, { useCallback, useState } from "react";
import styles from "./Container.module.css";
import { SearchResults } from "@components/SearchResults";
import { ViewState } from "@components/enums/ViewState";
import { DragAndDrop } from "@components/DragAndDrop";

export default function () {
  const [infoHashes, setInfoHashes] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<IResults>({
    query: "",
    results: [],
  });
  const [viewState, setViewState] = useState(ViewState.DOWNLOADS);

  const onFileSelect = useCallback(
    ({ infoHash }) => {
      if (infoHashes.includes(infoHash)) {
        // TODO: Show an error message
        return;
      }

      setInfoHashes([...infoHashes, infoHash]);
    },
    [infoHashes]
  );

  return (
    <div className={styles.pane}>
      <Header onResultsChange={setSearchResults} />
      <DragAndDrop viewState={viewState} onFileSelect={onFileSelect}>
        {viewState === ViewState.SEARCH && (
          <SearchResults searchResults={searchResults} />
        )}
      </DragAndDrop>
    </div>
  );
}
