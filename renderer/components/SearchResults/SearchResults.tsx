import React, { memo } from "react";
import { IResults } from "@components/Header";
import { useTable } from "react-table";
import styles from "./SearchResults.module.scss";
import SimpleBar from "simplebar-react";
import { makeData } from "@components/SearchResults/makeData";
import { TorrentResult } from "../../../types/TorrentResult";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import { useTransition, animated, config } from "react-spring";

interface IProps {
  searchResults: IResults;
  onTorrentSelect: (torrent: TorrentResult) => void;
  isLoading: boolean;
}

export const SearchResults: React.FC<IProps> = memo(
  ({
    searchResults: { query, results } = {
      query: "",
      results: [],
    },
    onTorrentSelect,
    isLoading,
  }) => {
    const { columns, data: _data } = makeData(results);

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({ columns, data: _data });

    const transitions = useTransition(isLoading, null, {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      config: config.stiff,
    });

    return (
      <div className={styles.results}>
        <SimpleBar className={styles.simplebar}>
          <div className={styles.resultsTableWrapper}>
            <table {...getTableProps()} className={styles.resultsTable}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        className={styles.columnheader}
                        {...column.getHeaderProps()}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      onClick={() => onTorrentSelect(row.original)}
                      className={styles.cell}
                      {...row.getRowProps()}
                    >
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SimpleBar>

        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div
                style={props}
                key={key}
                className={styles.resultsLoader}
              >
                <Icon size={1.5} path={mdiLoading} spin color={"#fff"} />
              </animated.div>
            )
        )}
      </div>
    );
  }
);
