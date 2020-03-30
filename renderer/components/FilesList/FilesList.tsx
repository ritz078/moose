import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTable } from "react-table";
import { IFile, ITorrentDetails } from "../../../types/TorrentDetails";
import styles from "./FilesList.module.scss";
import { FileType } from "@enums/FileType";
import Icon from "@mdi/react";
import { mdiFan, mdiVlc } from "@mdi/js";
import SimpleBar from "simplebar-react";
import { ipcRenderer } from "electron";
import ReactDOM from "react-dom";
import { useTransition, animated, config } from "react-spring";

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
  const [isFetchingCaption, setIsFetchingCaption] = useState(false);

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

  const play = useCallback(({ url, type, isMovieOrShow, index }: IFile) => {
    if (type !== FileType.VIDEO) return;
    (async function () {
      let caption;
      if (isMovieOrShow) {
        setIsFetchingCaption(true);
        caption = await ipcRenderer.invoke(
          "getCaptions",
          torrentDetails.infoHash,
          index - 1
        );
        setIsFetchingCaption(false);
      }

      await ipcRenderer.invoke("playOnVlc", url, caption);
    })();
  }, []);

  const openFile = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <>
      <SimpleBar className={styles.files}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
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
                <tr {...row.getRowProps()} onClick={openFile}>
                  {row.cells.map((cell) => {
                    let vlcElement;
                    if (cell.column.id === "play") {
                      if (cell.value === FileType.VIDEO) {
                        vlcElement = (
                          <Icon
                            path={mdiVlc}
                            color="orange"
                            size={0.7}
                            title="Play in VLC"
                          />
                        );
                      } else {
                        vlcElement = null;
                      }
                    }
                    return (
                      <td
                        onClick={
                          vlcElement
                            ? (e) => {
                                e.stopPropagation();
                                play(cell.row.original);
                              }
                            : undefined
                        }
                        data-id={cell.column.id}
                        {...cell.getCellProps()}
                      >
                        {vlcElement ?? cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </SimpleBar>
      <LoaderModal show={isFetchingCaption} />
    </>
  );
});

const LoaderModal: React.FC<{ show: boolean }> = ({ show }) => {
  const elRef = useRef<HTMLDivElement>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    elRef.current = document.createElement("div");
    document.body.appendChild(elRef.current);

    setIsMounted(true);
    return () => {
      elRef.current && document.body.removeChild(elRef.current);
    };
  }, []);

  const transitions = useTransition(show, null, {
    from: { transform: "scale(0.5)", opacity: 0 },
    enter: { transform: "scale(1)", opacity: 1 },
    leave: { transform: "scale(0.5)", opacity: 0 },
    config: config.wobbly,
  });

  return isMounted
    ? ReactDOM.createPortal(
        transitions.map(
          ({ item, props, key }) =>
            item && (
              <animated.div
                style={props}
                key={key}
                className={styles.loaderModal}
              >
                <Icon path={mdiFan} size={3} spin color={"white"} />
                Searching for Subtitles
              </animated.div>
            )
        ),
        elRef.current
      )
    : null;
};
