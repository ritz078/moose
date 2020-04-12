import prettyMs from "pretty-ms";

export const columns = [
  { Header: "#", accessor: "index", Cell: ({ value }) => value + 1 },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Size",
    accessor: "size",
  },
  {
    Header: "Download Speed",
    accessor: "downloadSpeed",
  },
  {
    Header: "Peers",
    accessor: "numPeers",
  },
  {
    Header: "Downloaded",
    accessor: "progress",
  },
  {
    Header: "Time Remaining",
    accessor: "timeRemaining",
    Cell: ({ value }) =>
      value && isFinite(value) ? prettyMs(value, { compact: true }) : value,
  },
  {
    id: "delete",
  },
];
