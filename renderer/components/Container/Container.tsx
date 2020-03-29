import { Header, IResults } from "../Header";
import React, { useCallback, useState } from "react";
import styles from "./Container.module.css";
import { SearchResults } from "@components/SearchResults";
import { ViewState } from "@enums/ViewState";
import { DragAndDrop } from "@components/DragAndDrop";
import { TorrentDetails } from "@components/TorrentDetails";
import { TorrentResult } from "../../../types/TorrentResult";

export default function () {
  const [infoHashes, setInfoHashes] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<IResults>({
    query: "",
    results: [],
  });
  const [viewState, setViewState] = useState(ViewState.SEARCH);
  const [selectedTorrent, setSelectedTorrent] = useState<TorrentResult>(null);

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
      <Header
        viewState={viewState}
        setViewState={setViewState}
        onResultsChange={setSearchResults}
      />
      <DragAndDrop viewState={viewState} onFileSelect={onFileSelect}>
        {viewState === ViewState.SEARCH && (
          <SearchResults
            onTorrentSelect={setSelectedTorrent}
            searchResults={searchResults}
          />
        )}

        <TorrentDetails torrent={selectedTorrent} />
      </DragAndDrop>
    </div>
  );
}
