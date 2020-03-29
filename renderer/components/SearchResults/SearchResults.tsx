import React, { memo } from "react";
import { IResults } from "@components/Header";
import { useTable } from "react-table";
import styles from "./SearchResults.module.scss";
import SimpleBar from "simplebar-react";
import { makeData } from "@components/SearchResults/makeData";
import { TorrentResult } from "../../../types/TorrentResult";

interface IProps {
  searchResults: IResults;
  onTorrentSelect: (torrent: TorrentResult) => void;
}

const data = [
  {
    provider: "Rarbg",
    title: "Parasite.2019.KOREAN.1080p.BluRay.H264.AAC-VXT",
    time: "2019-11-29 10:40:31 +0000",
    seeds: 1962,
    peers: 225,
    size: "2.5 GiB",
    magnet:
      "magnet:?xt=urn:btih:66b8ac047bb6c15914038673234313612449f5d6&dn=Parasite.2019.KOREAN.1080p.BluRay.H264.AAC-VXT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_0_7_0_5_7_8__66b8ac047b",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.KOREAN.720p.BluRay.H264.AAC-VXT",
    time: "2019-11-29 09:45:14 +0000",
    seeds: 1422,
    peers: 182,
    size: "1.6 GiB",
    magnet:
      "magnet:?xt=urn:btih:ffd237d041fe2393a698253bee7887f0ad7f8202&dn=Parasite.2019.KOREAN.720p.BluRay.H264.AAC-VXT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_0_7_0_5_3_6__ffd237d041",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.KOREAN.720p.BluRay.x264.DTS-FGT",
    time: "2019-11-29 09:34:28 +0000",
    seeds: 709,
    peers: 257,
    size: "6.5 GiB",
    magnet:
      "magnet:?xt=urn:btih:4de43f99e02cffcfe90abab3a0f214abab05cd20&dn=Parasite.2019.KOREAN.720p.BluRay.x264.DTS-FGT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_0_7_0_5_2_3__4de43f99e0",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.1080p.BluRay.x264-REGRET",
    time: "2020-01-05 04:34:27 +0000",
    seeds: 525,
    peers: 96,
    size: "9.9 GiB",
    magnet:
      "magnet:?xt=urn:btih:264d238e72d938af8cebb74693226507a836e841&dn=Parasite.2019.1080p.BluRay.x264-REGRET&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_1_0_4_1_7_2__264d238e72",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.KOREAN.1080p.BluRay.x264.DTS-FGT",
    time: "2019-11-29 10:44:59 +0000",
    seeds: 395,
    peers: 74,
    size: "12.0 GiB",
    magnet:
      "magnet:?xt=urn:btih:6d54f137fcfc3ac204a0dbf2998c4aa9acbe5e80&dn=Parasite.2019.KOREAN.1080p.BluRay.x264.DTS-FGT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_0_7_0_5_8_0__6d54f137fc",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.KOREAN.1080p.WEBRip.x264.AAC2.0-NOGRP",
    time: "2019-08-11 17:24:48 +0000",
    seeds: 391,
    peers: 35,
    size: "5.0 GiB",
    magnet:
      "magnet:?xt=urn:btih:a39e4232842fd09608162521df562b34e61bb22a&dn=Parasite.2019.KOREAN.1080p.WEBRip.x264.AAC2.0-NOGRP&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=1_9_2_0_0_0_2__a39e423284",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.KOREAN.WEBRip.x264-ION10",
    time: "2019-08-11 18:23:32 +0000",
    seeds: 257,
    peers: 35,
    size: "1.3 GiB",
    magnet:
      "magnet:?xt=urn:btih:3c5a6f1fe1ee3504595d688f3708b56b38edf050&dn=Parasite.2019.KOREAN.WEBRip.x264-ION10&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=1_9_2_0_0_1_9__3c5a6f1fe1",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.BDRip.x264-REGRET",
    time: "2020-01-05 04:23:32 +0000",
    seeds: 172,
    peers: 33,
    size: "639.4 MiB",
    magnet:
      "magnet:?xt=urn:btih:49b0243b3d379c7261b0760d1fb801b16da6cd9e&dn=Parasite.2019.BDRip.x264-REGRET&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_1_0_4_1_6_4__49b0243b3d",
  },
  {
    provider: "Rarbg",
    title:
      "Parasite.2019.KOREAN.2160p.UHD.BluRay.X265.10bit.HDR.TrueHD.7.1.Atmos-IAMABLE",
    time: "2020-02-22 10:48:37 +0000",
    seeds: 134,
    peers: 81,
    size: "35.8 GiB",
    magnet:
      "magnet:?xt=urn:btih:1288fd53174fed47744df5e8ed3209521a27b64a&dn=Parasite.2019.KOREAN.2160p.UHD.BluRay.X265.10bit.HDR.TrueHD.7.1.Atmos-IAMABLE&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_1_5_3_9_6_9__1288fd5317",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.KOREAN.1080p.BluRay.x264.TrueHD.7.1.Atmos-FGT",
    time: "2019-11-29 10:45:14 +0000",
    seeds: 125,
    peers: 16,
    size: "15.0 GiB",
    magnet:
      "magnet:?xt=urn:btih:2f600fca6c5b15b0ce3b16897f228da50c44e079&dn=Parasite.2019.KOREAN.1080p.BluRay.x264.TrueHD.7.1.Atmos-FGT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_0_7_0_5_8_2__2f600fca6c",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.720p.BluRay.x264-REGRET",
    time: "2020-01-05 04:26:50 +0000",
    seeds: 125,
    peers: 33,
    size: "6.6 GiB",
    magnet:
      "magnet:?xt=urn:btih:728910f00922f21d298796d4f02fc357f1fad88e&dn=Parasite.2019.720p.BluRay.x264-REGRET&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_1_0_4_1_6_6__728910f009",
  },
  {
    provider: "Rarbg",
    title:
      "Parasite.2019.KOREAN.1080p.BluRay.REMUX.AVC.DTS-HD.MA.TrueHD.7.1.Atmos-FGT",
    time: "2019-11-29 08:40:20 +0000",
    seeds: 90,
    peers: 14,
    size: "34.8 GiB",
    magnet:
      "magnet:?xt=urn:btih:f5db70043ec66572aeece6b5355166ffff2e62a5&dn=Parasite.2019.KOREAN.1080p.BluRay.REMUX.AVC.DTS-HD.MA.TrueHD.7.1.Atmos-FGT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_0_7_0_4_7_5__f5db70043e",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.KOREAN.INTERNAL.1080p.BluRay.X264-AMIABLE",
    time: "2020-02-22 14:47:23 +0000",
    seeds: 74,
    peers: 13,
    size: "19.7 GiB",
    magnet:
      "magnet:?xt=urn:btih:479783ea40e9e51e558ad332a8c04b66753710fa&dn=Parasite.2019.KOREAN.INTERNAL.1080p.BluRay.X264-AMIABLE&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_1_5_4_1_2_6__479783ea40",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.KOREAN.BRRip.XviD.MP3-VXT",
    time: "2019-11-29 08:56:10 +0000",
    seeds: 63,
    peers: 11,
    size: "1.3 GiB",
    magnet:
      "magnet:?xt=urn:btih:bdd8195fca3d87e4021bbc670dffeb242b0bd47c&dn=Parasite.2019.KOREAN.BRRip.XviD.MP3-VXT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_0_7_0_4_8_8__bdd8195fca",
  },
  {
    provider: "Rarbg",
    title:
      "Parasite.2019.KOREAN.2160p.BluRay.REMUX.HEVC.DTS-HD.MA.TrueHD.7.1.Atmos-FGT",
    time: "2020-02-22 18:17:46 +0000",
    seeds: 32,
    peers: 30,
    size: "85.5 GiB",
    magnet:
      "magnet:?xt=urn:btih:635100a77687dd3c1a99368c4e7d48a09b3ea518&dn=Parasite.2019.KOREAN.2160p.BluRay.REMUX.HEVC.DTS-HD.MA.TrueHD.7.1.Atmos-FGT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_1_5_4_1_9_7__635100a776",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.KOREAN.1080p.BluRay.x264.DTS-HD.MA.7.1-FGT",
    time: "2019-11-29 10:45:07 +0000",
    seeds: 31,
    peers: 2,
    size: "14.4 GiB",
    magnet:
      "magnet:?xt=urn:btih:62fed8ea812eea1612eebd9b7247a605c502d54b&dn=Parasite.2019.KOREAN.1080p.BluRay.x264.DTS-HD.MA.7.1-FGT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_0_7_0_5_8_1__62fed8ea81",
  },
  {
    provider: "Rarbg",
    title:
      "Parasite.2019.KOREAN.2160p.BluRay.x265.10bit.SDR.DTS-HD.MA.TrueHD.7.1.Atmos-SWTYBLZ",
    time: "2020-02-23 10:42:48 +0000",
    seeds: 19,
    peers: 34,
    size: "78.3 GiB",
    magnet:
      "magnet:?xt=urn:btih:9c24524d2f773a61363b79c291c68a4ba179e1d9&dn=Parasite.2019.KOREAN.2160p.BluRay.x265.10bit.SDR.DTS-HD.MA.TrueHD.7.1.Atmos-SWTYBLZ&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_1_5_5_0_1_7__9c24524d2f",
  },
  {
    provider: "Rarbg",
    title: "Parasite.2019.KOREAN.2160p.BluRay.HEVC.TrueHD.7.1.Atmos-MMCLX",
    time: "2020-02-22 17:37:16 +0000",
    seeds: 15,
    peers: 11,
    size: "89.4 GiB",
    magnet:
      "magnet:?xt=urn:btih:a90d4354a1d1b189f178ee6f5428a4d0fab731d2&dn=Parasite.2019.KOREAN.2160p.BluRay.HEVC.TrueHD.7.1.Atmos-MMCLX&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_1_5_4_1_7_5__a90d4354a1",
  },
  {
    provider: "Rarbg",
    title: "Parasites.2016.1080p.WEBRip.x264-RARBG",
    time: "2020-01-27 08:33:25 +0000",
    seeds: 9,
    peers: 1,
    size: "1.5 GiB",
    magnet:
      "magnet:?xt=urn:btih:b33ff9add05a943451c827323c48d93b09430031&dn=Parasites.2016.1080p.WEBRip.x264-RARBG&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_1_2_7_3_7_6__b33ff9add0",
  },
  {
    provider: "Rarbg",
    title: "Parasite.1982.1080p.BluRay.H264.AAC-RARBG",
    time: "2019-10-27 18:17:31 +0000",
    seeds: 8,
    peers: 0,
    size: "1.6 GiB",
    magnet:
      "magnet:?xt=urn:btih:26373b96f121a9f7b17d24168e7f996e3cdd631e&dn=Parasite.1982.1080p.BluRay.H264.AAC-RARBG&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_0_3_9_2_5_6__26373b96f1",
  },
];

export const SearchResults: React.FC<IProps> = memo(
  ({ searchResults: { query, results }, onTorrentSelect }) => {
    const { columns, data: _data } = makeData(data);

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
