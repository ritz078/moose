import React, { memo, useCallback } from "react";
import { useTable } from "react-table";
import { IFile, ITorrentDetails } from "../../../types/TorrentDetails";
import styles from "./FilesList.module.scss";
import { FileType } from "@enums/FileType";
import Icon from "@mdi/react";
import { mdiVlc } from "@mdi/js";
import SimpleBar from "simplebar-react";
import { ipcRenderer } from "electron";

const header = [
  { Header: "#", accessor: "index" },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Size",
    accessor: "size",
  },
  {
    id: "play",
    accessor: "type",
  },
];

interface IProps {
  torrentDetails: ITorrentDetails;
}

export const FilesList: React.FC<IProps> = memo(({ torrentDetails }) => {
  if (!torrentDetails) return null;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<IFile>({
    columns: header,
    data: torrentDetails.files,
  });

  const play = useCallback(({ url, type }: IFile) => {
    if (type !== FileType.VIDEO) return;
    (async function () {
      await ipcRenderer.invoke("playOnVlc", url);
    })();
  }, []);

  return (
    <SimpleBar className={styles.files}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  let element = cell.render("Cell");
                  if (cell.column.id === "play") {
                    if (cell.value === FileType.VIDEO) {
                      element = (
                        <Icon
                          path={mdiVlc}
                          color="orange"
                          size={0.7}
                          title="Play in VLC"
                        />
                      );
                    } else {
                      element = null;
                    }
                  }
                  return (
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        play(cell.row.original);
                      }}
                      data-id={cell.column.id}
                      {...cell.getCellProps()}
                    >
                      {element}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </SimpleBar>
  );
});
