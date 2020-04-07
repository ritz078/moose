import React, { memo, useCallback } from "react";
import styles from "./Header.module.scss";
import Icon from "@mdi/react";
import { mdiCast, mdiCloseCircle, mdiCog, mdiMagnify } from "@mdi/js";
import { TorrentResult } from "../../../types/TorrentResult";
import { Modal } from "@components/Modal";
import { Preferences } from "@components/Preferences";

export interface IResults {
  results: TorrentResult[];
  query: string;
}

interface IProps {
  onResultsChange: (results: IResults) => void;
  onSearchStatusChange: (isLoading: boolean) => void;
}

export const Header: React.FC<IProps> = memo(
  ({ onResultsChange, onSearchStatusChange }) => {
    return (
      <div className={styles.header}>
        <div></div>
        <Navbar />
        <Search
          onSearchStatusChange={onSearchStatusChange}
          onResultsChange={onResultsChange}
        />
      </div>
    );
  }
);

const Navbar: React.FC<Omit<
  Omit<IProps, "onResultsChange">,
  "onSearchStatusChange"
>> = memo(() => {
  return (
    <div className={styles.navbar}>
      <button>
        <Icon path={mdiCast} title="Settings" size={0.72} />
      </button>
      <button>
        <Icon path={mdiCog} title="Settings" size={0.72} />
      </button>

      <Modal show={false} onCloseRequest={console.log}>
        <Preferences />
      </Modal>
    </div>
  );
});

const Search: React.FC<Omit<IProps, "viewState">> = memo(
  ({ onResultsChange, onSearchStatusChange }) => {
    const [query, setQuery] = React.useState("");

    const fetchResults = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.length) {
          (async function () {
            onSearchStatusChange(true);
            // TODO
            onSearchStatusChange(false);
          })();
        }
      },
      [query]
    );

    return (
      <div className={styles.search}>
        <Icon
          className={styles.searchIcon}
          size={0.7}
          path={mdiMagnify}
          title="Find"
        />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Find Torrents"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={fetchResults}
          value={query}
        />

        {!!query.length && (
          <Icon
            className={styles.closeIcon}
            size={0.5}
            path={mdiCloseCircle}
            title="Find"
            onClick={() => setQuery("")}
          />
        )}
      </div>
    );
  }
);
