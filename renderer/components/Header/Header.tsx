import React, { memo, useEffect } from "react";
import styles from "./Header.module.scss";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

export const Header: React.FC<{}> = memo(() => {
  const [query, setQuery] = React.useState("");

  useEffect(() => {
    console.log(query)
  }, [query]);

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
          onChange={e => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
});
