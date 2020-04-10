export const columns = [
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
  // {
  // 	Header: "Time Remaining",
  // 	accessor: "timeRemaining",
  // },
  {
    id: "delete",
  },
];
