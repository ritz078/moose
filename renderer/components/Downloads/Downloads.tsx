import React, { memo, useEffect, useState } from "react";
import { useTable } from "react-table";
import styles from "./Downloads.module.scss";
import SimpleBar from "simplebar-react";
import { columns } from "./makeData";
import { ipcRenderer } from "electron";
import { DownloadingTorrent } from "../../../types/DownloadingTorrent";

export interface Download {
  magnet: string;
  name: string;
}

interface IProps {
  downloads: Download[];
  onTorrentSelect: (torrent: DownloadingTorrent) => void;
}

export const Downloads: React.FC<IProps> = memo(
  ({ onTorrentSelect, downloads }) => {
    const [data, setData] = useState([]);

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({ columns, data });

    useEffect(() => {
      (async function () {
        await ipcRenderer.invoke("addTorrentsToDownload", downloads);

        const intervalId = setInterval(() => {
          const torrents = ipcRenderer.sendSync("progress");
          setData(torrents);
        }, 1000);

        return () => {
          clearInterval(intervalId);
        };
      })();
    }, [downloads]);

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
      </div>
    );
  }
);
