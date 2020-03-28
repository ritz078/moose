import React, { memo } from "react";
import { IResults } from "@components/Header";
import { useTable } from "react-table";
import styles from "./SearchResults.module.scss";
import prettyTime from "time-ago";
import SimpleBar from "simplebar-react";

interface IProps {
  searchResults: IResults;
}

const data = [
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E15.720P.WEB.X264-POKE[rartv]",
    time: "2020-03-17 17:47:10 +0000",
    seeds: 442,
    peers: 26,
    size: "903.5 MiB",
    magnet:
      "magnet:?xt=urn:btih:72bda6459e901591a94626e095894b48c329392f&dn=The.Flash.2014.S06E15.720P.WEB.X264-POKE%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_7_6_6_0_5__72bda6459e",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E15.1080P.WEB.X264-POKE[rartv]",
    time: "2020-03-17 17:45:25 +0000",
    seeds: 440,
    peers: 55,
    size: "2.2 GiB",
    magnet:
      "magnet:?xt=urn:btih:7c76281981788ca0af8e77a3c14b1bdf56954912&dn=The.Flash.2014.S06E15.1080P.WEB.X264-POKE%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_7_6_6_0_3__7c76281981",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E14.720p.HDTV.x264-SVA[rartv]",
    time: "2020-03-11 01:01:09 +0000",
    seeds: 412,
    peers: 33,
    size: "835.1 MiB",
    magnet:
      "magnet:?xt=urn:btih:2c0e394df1a99581a23d177c8f58018ef22fc9aa&dn=The.Flash.2014.S06E14.720p.HDTV.x264-SVA%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_7_0_7_7_5__2c0e394df1",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E14.HDTV.x264-SVA[rartv]",
    time: "2020-03-11 01:01:07 +0000",
    seeds: 384,
    peers: 40,
    size: "245.5 MiB",
    magnet:
      "magnet:?xt=urn:btih:1a3602b511b67b1c646d69f477943b2dc3e67b19&dn=The.Flash.2014.S06E14.HDTV.x264-SVA%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_7_0_7_7_4__1a3602b511",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E13.720p.HDTV.x264-SVA[rartv]",
    time: "2020-02-26 02:02:25 +0000",
    seeds: 242,
    peers: 21,
    size: "1.1 GiB",
    magnet:
      "magnet:?xt=urn:btih:646e4f4eba0f712dc77c8e15fc8552a939d79118&dn=The.Flash.2014.S06E13.720p.HDTV.x264-SVA%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_5_7_4_7_2__646e4f4eba",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E12.720p.HDTV.x264-SVA[rartv]",
    time: "2020-02-19 02:01:13 +0000",
    seeds: 193,
    peers: 18,
    size: "797.0 MiB",
    magnet:
      "magnet:?xt=urn:btih:f43adba8605c7fb31cd8e0f818428d33b424ff8f&dn=The.Flash.2014.S06E12.720p.HDTV.x264-SVA%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_5_0_6_2_2__f43adba860",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E10.HDTV.x264-SVA[rartv]",
    time: "2020-02-05 02:00:53 +0000",
    seeds: 192,
    peers: 11,
    size: "237.4 MiB",
    magnet:
      "magnet:?xt=urn:btih:a114a61f25560470c12cd7f2fbb871a969b01d4b&dn=The.Flash.2014.S06E10.HDTV.x264-SVA%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_3_6_3_5_2__a114a61f25",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E15.WEB.H264-XLF[rartv]",
    time: "2020-03-18 05:03:21 +0000",
    seeds: 191,
    peers: 12,
    size: "389.3 MiB",
    magnet:
      "magnet:?xt=urn:btih:14102cfbe09d21a5a207d3166560d8144bb947e0&dn=The.Flash.2014.S06E15.WEB.H264-XLF%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_7_6_8_7_1__14102cfbe0",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E10.720p.HDTV.x264-SVA[rartv]",
    time: "2020-02-05 02:01:06 +0000",
    seeds: 182,
    peers: 20,
    size: "823.7 MiB",
    magnet:
      "magnet:?xt=urn:btih:9be2a068b1d8ff53e7d1f03ecf8ffc4e0869a3d9&dn=The.Flash.2014.S06E10.720p.HDTV.x264-SVA%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_3_6_3_5_3__9be2a068b1",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E11.720p.HDTV.x264-KILLERS[rartv]",
    time: "2020-02-12 02:48:50 +0000",
    seeds: 172,
    peers: 10,
    size: "858.6 MiB",
    magnet:
      "magnet:?xt=urn:btih:0f4bc7a3757167281531bf80d9b675c242be2c01&dn=The.Flash.2014.S06E11.720p.HDTV.x264-KILLERS%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_4_3_5_0_8__0f4bc7a375",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.S06E15.WEBRip.x264-ION10",
    time: "2020-03-18 15:04:09 +0000",
    seeds: 164,
    peers: 18,
    size: "411.0 MiB",
    magnet:
      "magnet:?xt=urn:btih:dcb4ecf507c6ce0e0996dde2c48275934f03db25&dn=The.Flash.S06E15.WEBRip.x264-ION10&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_7_7_2_4_6__dcb4ecf507",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E14.1080p.WEB.H264-XLF[rartv]",
    time: "2020-03-11 05:06:39 +0000",
    seeds: 155,
    peers: 28,
    size: "2.4 GiB",
    magnet:
      "magnet:?xt=urn:btih:bce754543c97756bdfe7c9558c474c73abccceb7&dn=The.Flash.2014.S06E14.1080p.WEB.H264-XLF%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_7_0_9_2_4__bce754543c",
  },
  {
    provider: "Rarbg",
    title:
      "The.Flash.2014.S06E15.The.Exorcism.of.Nash.Wells.1080p.AMZN.WEBRip.DDP5.1.x264-NTb[rartv]",
    time: "2020-03-18 14:53:03 +0000",
    seeds: 147,
    peers: 10,
    size: "2.7 GiB",
    magnet:
      "magnet:?xt=urn:btih:b833e0b3905339df56c19d0433e2d8aae632fdd2&dn=The.Flash.2014.S06E15.The.Exorcism.of.Nash.Wells.1080p.AMZN.WEBRip.DDP5.1.x264-NTb%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_7_7_2_4_4__b833e0b390",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E11.HDTV.x264-KILLERS[rartv]",
    time: "2020-02-12 02:31:07 +0000",
    seeds: 143,
    peers: 6,
    size: "255.8 MiB",
    magnet:
      "magnet:?xt=urn:btih:194ddb0f04633bd520341efbea2e8b627b69e330&dn=The.Flash.2014.S06E11.HDTV.x264-KILLERS%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_4_3_4_9_5__194ddb0f04",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E12.HDTV.x264-SVA[rartv]",
    time: "2020-02-19 02:01:05 +0000",
    seeds: 138,
    peers: 11,
    size: "226.5 MiB",
    magnet:
      "magnet:?xt=urn:btih:78dd13316ccea279b2bbb9d514ef5ae29b287739&dn=The.Flash.2014.S06E12.HDTV.x264-SVA%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_5_0_6_2_1__78dd13316c",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E13.1080p.WEB.H264-XLF[rartv]",
    time: "2020-02-26 06:05:21 +0000",
    seeds: 107,
    peers: 9,
    size: "2.4 GiB",
    magnet:
      "magnet:?xt=urn:btih:1fc6e389b1d74a515e9fe3b3b8d4796e2dc4d340&dn=The.Flash.2014.S06E13.1080p.WEB.H264-XLF%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_5_7_6_1_9__1fc6e389b1",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E13.WEB.H264-XLF[rartv]",
    time: "2020-02-26 06:03:00 +0000",
    seeds: 99,
    peers: 7,
    size: "387.9 MiB",
    magnet:
      "magnet:?xt=urn:btih:69b35490964269bcd4bb1dea6a9594280af13b0b&dn=The.Flash.2014.S06E13.WEB.H264-XLF%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_5_7_6_1_7__69b3549096",
  },
  {
    provider: "Rarbg",
    title:
      "The.Flash.2014.S06E14.Death.of.the.Speed.Force.1080p.AMZN.WEBRip.DDP5.1.x264-NTb[rartv]",
    time: "2020-03-12 14:54:01 +0000",
    seeds: 93,
    peers: 9,
    size: "2.6 GiB",
    magnet:
      "magnet:?xt=urn:btih:866f8fe78cdfbefdf35d4c7e827a5983f10187c1&dn=The.Flash.2014.S06E14.Death.of.the.Speed.Force.1080p.AMZN.WEBRip.DDP5.1.x264-NTb%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_7_2_2_4_7__866f8fe78c",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.2014.S06E08.720p.HDTV.x264-SVA[rartv]",
    time: "2019-12-04 02:00:43 +0000",
    seeds: 90,
    peers: 11,
    size: "878.2 MiB",
    magnet:
      "magnet:?xt=urn:btih:c044bca4bb0594ab731ad6219c31dee3a5075974&dn=The.Flash.2014.S06E08.720p.HDTV.x264-SVA%5Brartv%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_0_7_4_8_9_2__c044bca4bb",
  },
  {
    provider: "Rarbg",
    title: "The.Flash.S06E14.WEBRip.x264-ION10",
    time: "2020-03-12 15:07:22 +0000",
    seeds: 87,
    peers: 10,
    size: "411.0 MiB",
    magnet:
      "magnet:?xt=urn:btih:3da40bf77a9ecbb65cb4985faf886ecc4ddcfcd3&dn=The.Flash.S06E14.WEBRip.x264-ION10&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=uko96bvfqy&p=2_1_7_2_2_5_6__3da40bf77a",
  },
];

export const SearchResults: React.FC<IProps> = memo(
  ({ searchResults: { query, results } }) => {
    const _data = data.map((x, i) => ({
      ...x,
      index: i + 1,
      time: `${prettyTime.ago(new Date(x.time).getTime(), true)} ago`,
    }));

    const columns = React.useMemo(
      () => [
        { Header: "#", accessor: "index" },
        {
          Header: "Name",
          accessor: "title",
        },
        {
          Header: "Size",
          accessor: "size",
        },
        {
          Header: "Seeds",
          accessor: "seeds",
        },
        {
          Header: "Peers",
          accessor: "peers",
        },
        {
          Header: "Time",
          accessor: "time",
        },
      ],
      []
    );

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({ columns, data: _data });

    return (
      <div className={styles.results}>
        <div className={styles.resultsLabel}>
          {results.length} results for <b>{query}</b>
        </div>

        <SimpleBar style={{ maxHeight: "calc(100vh - 80px)" }}>
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
                    <tr className={styles.cell} {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
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
