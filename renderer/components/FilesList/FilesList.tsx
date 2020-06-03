import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTable } from "react-table";
import { IFile, ITorrentDetails } from "../../../types/TorrentDetails";
import styles from "./FilesList.module.scss";
import Icon from "@mdi/react";
import { mdiLoading, mdiVlc } from "@mdi/js";
import SimpleBar from "simplebar-react";
import { ipcRenderer, shell } from "electron";
import ReactDOM from "react-dom";
import { animated } from "react-spring";
import { Player } from "@components/Player";
import { getStreamingUrl, getSubtitles } from "@utils/url";
import { SelectedFileContext } from "@contexts/SelectedFileContext";
import { Modal } from "@components/Modal";
import { FileType } from "@enums/FileType";
import { scale } from "@utils/animations";
import { SelectedCastContext } from "@contexts/SelectedCast";
import { CastEvents } from "../../../shared/constants/CastEvents";

interface IProps {
  torrentDetails: ITorrentDetails;
  backdrop?: string;
}

export const FilesList: React.FC<IProps> = memo(
  ({ torrentDetails, backdrop }) => {
    if (!torrentDetails) return null;
    const [isFetchingCaption, setIsFetchingCaption] = useState(false);
    const { selectedFile, setSelectedFile } = useContext(SelectedFileContext);
    const { selectedCast } = useContext(SelectedCastContext);

    const header = useMemo(
      () => [
        {
          Header: "Name",
          accessor: "name",
          Cell: ({ cell }) => {
            const { type, index } = cell.row.original;
            return (
              <>
                {(type === FileType.AUDIO || type === FileType.VIDEO) &&
                  selectedFile?.index === index && (
                    <span className={styles.playIcon}>►</span>
                  )}
                {cell.value}
              </>
            );
          },
        },
        {
          Header: "Size",
          accessor: "size",
        },
        {
          Header: "",
          id: "play",
          accessor: "type",
          Cell: ({ cell }) => {
            if (cell.column.id === "play" && cell.value === FileType.VIDEO) {
              return (
                <Icon
                  path={mdiVlc}
                  color="orange"
                  size={0.6}
                  className={styles.vlcIcon}
                  title="Play in VLC"
                />
              );
            }
            return null;
          },
        },
      ],
      [selectedFile]
    );

    const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable<
      IFile & { [k: string]: any }
    >({
      columns: header,
      data: torrentDetails.files
        .sort((a, b) => b.type - a.type)
        .map((file) => ({
          ...file,
          url: getStreamingUrl(file),
        })),
      getRowId: (originalRow) => originalRow.name,
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
      (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, file: IFile) => {
        e.stopPropagation();
        if (selectedFile && file.id === selectedFile.id) return;

        if (selectedCast) {
          ipcRenderer.send(
            CastEvents.PLAY_ON_CAST,
            selectedCast.host,
            getStreamingUrl(file),
            { title: file.name, type: file.mime }
          );
          setSelectedFile(file);
          return;
        }

        (async function () {
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
          } else if (file.type === FileType.AUDIO) {
            setSelectedFile(file);
          } else {
            await shell.openPath(file.path);
          }
        })();
      },
      [torrentDetails, selectedFile]
    );

    return (
      <>
        <SimpleBar className={styles.files}>
          <table {...getTableProps()}>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={(e) => openFile(e, row.original)}
                  >
                    {row.cells.map((cell) => (
                      <td
                        onClick={
                          cell.column.id === "play" &&
                          cell.value === FileType.VIDEO
                            ? (e) => {
                                e.stopPropagation();
                                playOnVLC(cell.row.original);
                              }
                            : undefined
                        }
                        data-id={cell.column.id}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SimpleBar>
        <LoaderModal show={isFetchingCaption} />
        <Modal
          onCloseRequest={() => setSelectedFile(null)}
          show={
            selectedFile &&
            selectedFile.type === FileType.VIDEO &&
            !selectedCast
          }
          fullScreen
        >
          <Player
            backdrop={backdrop}
            playOnVlc={playOnVLC}
            file={selectedFile}
          />
        </Modal>
      </>
    );
  }
);

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

  const transitions = scale(show);

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
                <Icon path={mdiLoading} size={1} spin color={"white"} />
                Searching for Subtitles
              </animated.div>
            )
        ),
        elRef.current
      )
    : null;
};
