import React, { memo, useCallback } from "react";
import styles from "./Header.module.scss";
import Icon from "@mdi/react";
import { mdiCloseCircle, mdiMagnify } from "@mdi/js";
import { ipcRenderer } from "electron";
import { TorrentResult } from "../../../types/TorrentResult";

export interface IResults {
  results: TorrentResult[];
  query: string;
}

interface IProps {
  onResultsChange: (results: IResults) => void;
}

export const Header: React.FC<IProps> = memo(({ onResultsChange }) => {
  const [query, setQuery] = React.useState("");

  const fetchResults = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && query.length) {
        (async function () {
          const results = await ipcRenderer.invoke("get-torrents", query);
          console.log(results);
          onResultsChange({
            results,
            query,
          });
        })();
      }
    },
    [query]
  );

  return (
    <div className={styles.header}>
      <div className={styles.search}>
        <Icon
          className={styles.searchIcon}
          size={0.7}
          path={mdiMagnify}
          title="Search"
        />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={fetchResults}
          value={query}
        />

        {!!query.length && (
          <Icon
            className={styles.closeIcon}
            size={0.5}
            path={mdiCloseCircle}
            title="Search"
            onClick={() => setQuery("")}
          />
        )}
      </div>
    </div>
  );
});
