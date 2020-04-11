import React, {
  memo,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTable } from "react-table";
import styles from "./Downloads.module.scss";
import SimpleBar from "simplebar-react";
import { columns } from "./makeData";
import { ipcRenderer, remote } from "electron";
import { DownloadingTorrent } from "../../../types/DownloadingTorrent";
import Icon from "@mdi/react";
import { mdiDelete } from "@mdi/js";
import { deleteTorrent } from "@utils/url";

export interface Download {
  magnet: string;
  name: string;
  infoHash: string;
}

interface IProps {
  downloads: Download[];
  onTorrentSelect: (torrent: DownloadingTorrent) => void;
  onTorrentDelete: (infoHash: string) => void;
}

export const Downloads: React.FC<IProps> = memo(
  ({ onTorrentSelect, downloads, onTorrentDelete }) => {
    const [data, setData] = useState([]);
    const intervalId = useRef<number>(null);

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({
      columns,
      data,
      getRowId: (originalRow) => originalRow.infoHash,
    });

    useEffect(() => {
      (async function () {
        if (intervalId.current) clearInterval(intervalId.current);
        intervalId.current = window.setInterval(() => {
          const torrents = ipcRenderer.sendSync("progress", downloads);
          setData(torrents);
        }, 1000);
      })();
    }, [downloads]);

    const _deleteTorrent = useCallback(
      (
        e: SyntheticEvent<HTMLTableCellElement, MouseEvent>,
        { infoHash, name }: DownloadingTorrent
      ) => {
        e.stopPropagation();

        (async function () {
          const responseIndex = remote.dialog.showMessageBoxSync({
            type: "warning",
            message: `Do you also want to delete ${name} from your hard drive?`,
            buttons: ["Yes", "No", "Cancel"],
          });

          if (responseIndex === 2) return;

          if (intervalId.current) clearInterval(intervalId.current);

          try {
            await deleteTorrent(infoHash, responseIndex === 0);
            onTorrentDelete(infoHash);
          } catch (e) {}
        })();
      },
      []
    );
    console.log(data);

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
                        <td
                          {...cell.getCellProps()}
                          onClick={
                            cell.column.id === "delete"
                              ? (e) => _deleteTorrent(e, cell.row.original)
                              : undefined
                          }
                        >
                          {cell.column.id === "delete" && (
                            <Icon path={mdiDelete} size={0.7} />
                          )}
                          {cell.column.Header && cell.render("Cell")}
                        </td>
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
