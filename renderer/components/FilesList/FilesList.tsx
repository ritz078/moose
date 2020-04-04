import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTable } from "react-table";
import {
  IFile,
  ITorrentDetails,
  Subtitle,
} from "../../../types/TorrentDetails";
import styles from "./FilesList.module.scss";
import Icon from "@mdi/react";
import { mdiFan, mdiVlc } from "@mdi/js";
import SimpleBar from "simplebar-react";
import { ipcRenderer, shell } from "electron";
import ReactDOM from "react-dom";
import { animated, config, useTransition } from "react-spring";
import { Player } from "@components/Player";
import { FileType } from "@enums/FileType";
import { getStreamingUrl, getSubtitles } from "@utils/url";

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
  const [selectedFile, setSelectedFile] = useState<
    IFile & {
      subtitles: Subtitle[];
    }
  >(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<IFile>({
    columns: header,
    data: torrentDetails.files
      .sort((a, b) => b.type - a.type)
      .map((file) => ({
        ...file,
        url: getStreamingUrl(file),
      })),
  });

  const playOnVLC = useCallback(
    (file: IFile) => {
      if (file.type !== FileType.VIDEO) return;
      (async function () {
        setIsFetchingCaption(true);
        const subtitles = await getSubtitles(torrentDetails, file, true);
        await ipcRenderer.invoke(
          "playOnVlc",
          file.url,
          subtitles?.[0]?.srtPath
        );
        setIsFetchingCaption(false);
      })();
    },
    [torrentDetails]
  );

  const openFile = useCallback(
    (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, file: IFile) =>
      (async function () {
        e.stopPropagation();

        if (file.type === FileType.VIDEO) {
          setIsFetchingCaption(true);
          try {
            const subtitles = await getSubtitles(torrentDetails, file);
            setSelectedFile({
              ...file,
              subtitles,
            });
          } catch (e) {}
          setIsFetchingCaption(false);
        } else {
          await shell.openItem(file.path);
        }
      })(),
    [torrentDetails]
  );

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
                <tr
                  {...row.getRowProps()}
                  onClick={(e) => openFile(e, row.original)}
                >
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
                                playOnVLC(cell.row.original);
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
      <Player
        onCloseRequest={() => setSelectedFile(null)}
        file={selectedFile}
      />
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
