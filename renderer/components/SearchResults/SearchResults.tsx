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
    title: "Tears of Steel[1080p H264 Eng Ac3 MultiSub][TNTVillage]",
    link:
      "http://itorrents.org/torrent/624F30F5C86B658C997F8FA93FEC94D1D46F5892.torrent?title=Tears-of-Steel[1080p-H264-Eng-Ac3-MultiSub][TNTVillage]",
    seeds: 316,
    peers: 71,
    time: "1 Year+",
    size: "358.33 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel[1080p-H264-Eng-Ac3-MultiSub][TNTVillage]-torrent-1512039.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel[SHORT] 2012 BRRip AC3 XViD-RemixHD",
    link:
      "http://itorrents.org/torrent/D05361AD9E0D4BB168B05FFAF9CCE9BA6AC300DB.torrent?title=Tears-of-Steel[SHORT]-2012-BRRip-AC3-XViD-RemixHD",
    seeds: 36,
    peers: 63,
    time: "1 Year+",
    size: "232.92 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel[SHORT]-2012-BRRip-AC3-XViD-RemixHD-torrent-1518490.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears.Of.Steel.2012.iTALiAN.Subbed.BRRiP.XViD.NeWZoNe",
    link:
      "http://itorrents.org/torrent/4AE92D79F9A2DF95932604452ABF5F607CD96108.torrent?title=Tears Of Steel 2012 iTALiAN Subbed BRRiP XViD NeWZoNe",
    seeds: 27,
    peers: 36,
    time: "1 Year+",
    size: "274.14 MB",
    desc:
      "https://www.limetorrents.info/Tears%20Of%20Steel%202012%20iTALiAN%20Subbed%20BRRiP%20XViD%20NeWZoNe-torrent-1525441.html",
    provider: "Limetorrents",
  },
  {
    title: "Ð¡Ð»Ñ‘Ð·Ñ‹ ÑÑ‚Ð°Ð»Ð¸ Tears of Steel (2012) 4K DMRip 21..",
    link:
      "http://itorrents.org/torrent/6BDE2C83CBF9A2AC7F2083B2445F328CC139B1E7.torrent?title=Ð¡Ð»Ñ‘Ð·Ñ‹-ÑÑ‚Ð°Ð»Ð¸--Tears-of-Steel-(2012)-4K-DMRip-2160p-Ð¾Ñ‚-GORESEWAGE--LM--2xL1",
    seeds: 4,
    peers: 98,
    time: "1 Year+",
    size: "12.33 GB",
    desc:
      "https://www.limetorrents.info/Ð¡Ð»Ñ‘Ð·Ñ‹-ÑÑ‚Ð°Ð»Ð¸--Tears-of-Steel-(2012)-4K-DMRip-2160p-Ð¾Ñ‚-GORESEWAGE--LM--2xL1-torrent-4303444.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel(2012) BDRip 480p 50Mb Mkv-movieSEEkz",
    link:
      "http://itorrents.org/torrent/9D679DBE483583C44431D35A67D641C606CCA69E.torrent?title=Tears-of-Steel(2012)-BDRip-480p-50Mb-Mkv-movieSEEkz",
    seeds: 4,
    peers: 1,
    time: "1 Year+",
    size: "55.97 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel(2012)-BDRip-480p-50Mb-Mkv-movieSEEkz-torrent-1530230.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel (2012) BRRip(xvid) NL Subs DMT",
    link:
      "http://itorrents.org/torrent/D8B0537D46A1D44B4EB027037B09B7491EB11BEB.torrent?title=Tears-of-Steel-(2012)-BRRip(xvid)-NL-Subs-DMT",
    seeds: 4,
    peers: 17,
    time: "1 Year+",
    size: "317.58 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-(2012)-BRRip(xvid)-NL-Subs-DMT-torrent-1532399.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel (2012) 720pBR2XVID DD 2 0 (nl subs ext)) B-Sam",
    link:
      "http://itorrents.org/torrent/5392C5B746EBBEA2CBEF52C284BF3135144D9B6D.torrent?title=Tears-of-Steel-(2012)-720pBR2XVID-DD-2-0-(nl-subs-ext))-B-Sam",
    seeds: 3,
    peers: 16,
    time: "1 Year+",
    size: "350.46 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-(2012)-720pBR2XVID-DD-2-0-(nl-subs-ext))-B-Sam-torrent-1531155.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel 2012 BRRip AC3 XViD-RemixHD",
    link:
      "http://itorrents.org/torrent/7B184AE4DDD2F5D198A5A0058045F97E30BF9F5C.torrent?title=Tears-of-Steel-2012-BRRip-AC3-XViD-RemixHD",
    seeds: 2,
    peers: 8,
    time: "1 Year+",
    size: "233.06 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-BRRip-AC3-XViD-RemixHD-torrent-1520315.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel 2012 2160p 4K DMRip Eng HDCL mkv",
    link:
      "http://itorrents.org/torrent/975B60A7032F7D7C114DC7441B754DEFA4C6D659.torrent?title=Tears-of-Steel-2012-2160p-4K-DMRip-Eng-HDCL-mkv",
    seeds: 2,
    peers: 0,
    time: "1 Year+",
    size: "11.95 GB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-2160p-4K-DMRip-Eng-HDCL-mkv-torrent-4307068.html",
    provider: "Limetorrents",
  },
  {
    title:
      "Tears Of Steel - Full Length Animated Action Movie 2012 - 2013 Full Movie in Eng..",
    link:
      "http://itorrents.org/torrent/D0C4C27422527A9F3765C0F6855E9511044765DE.torrent?title=Tears-Of-Steel--Full-Length-Animated-Action-Movie-2012--2013-Full-Movie-in-English-Multi-Subtitle-mp4",
    seeds: 2,
    peers: 1,
    time: "1 Year+",
    size: "303.67 MB",
    desc:
      "https://www.limetorrents.info/Tears-Of-Steel--Full-Length-Animated-Action-Movie-2012--2013-Full-Movie-in-English-Multi-Subtitle-mp4-torrent-2918968.html",
    provider: "Limetorrents",
  },
  {
    title: "tears of steel 1080p webm (movie)",
    link:
      "http://itorrents.org/torrent/02767050E0BE2FD4DB9A2AD6C12416AC806ED6ED.torrent?title=tears-of-steel-1080p-webm-(movie)",
    seeds: 1,
    peers: 0,
    time: "1 Year+",
    size: "544.88 MB",
    desc:
      "https://www.limetorrents.info/tears-of-steel-1080p-webm-(movie)-torrent-1449610.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel[SHORT] 2012 BRRip AC3 XViD-RemixHD",
    link:
      "http://itorrents.org/torrent/AEBACA998B95CA366B491090FBC8E5670BE86B9F.torrent?title=Tears-of-Steel[SHORT]-2012-BRRip-AC3-XViD-RemixHD",
    seeds: 1,
    peers: 4,
    time: "1 Year+",
    size: "233.06 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel[SHORT]-2012-BRRip-AC3-XViD-RemixHD-torrent-1518474.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel 2012 Blu-ray 1080p DTS multisub-HighCode",
    link:
      "http://itorrents.org/torrent/8DCC14F1947302E111B890A3B47CEF2B507F037C.torrent?title=Tears-of-Steel-2012-Blu-ray-1080p-DTS-multisub-HighCode",
    seeds: 1,
    peers: 2,
    time: "1 Year+",
    size: "973.72 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-Blu-ray-1080p-DTS-multisub-HighCode-torrent-3781207.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel 2012 2160p DM DD5 1 x264-DON",
    link:
      "http://itorrents.org/torrent/A83525878992BC849B538DFB3CE870AB60AF03F0.torrent?title=Tears-of-Steel-2012-2160p-DM-DD5-1-x264-DON",
    seeds: 1,
    peers: 5,
    time: "1 Year+",
    size: "12.31 GB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-2160p-DM-DD5-1-x264-DON-torrent-3787542.html",
    provider: "Limetorrents",
  },
  {
    provider: "Rarbg",
    title: "Tears of Steel 2012 2160p DM DD5 1 x264-DON",
    time: "2013-11-30 13:16:22 +0000",
    seeds: 1,
    peers: 2,
    size: "12.3 GiB",
    magnet:
      "magnet:?xt=urn:btih:a83525878992bc849b538dfb3ce870ab60af03f0&dn=Tears+of+Steel+2012+2160p+DM+DD5+1+x264-DON&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
    desc:
      "https://torrentapi.org/redirect_to_info.php?token=nuo5kjvcgd&p=5_1_2_7_9_8__a835258789",
  },
  {
    title: "Tears of Steel 2012 2160p 6CH x265 HEVC-PSA",
    link:
      "http://itorrents.org/torrent/C53B71A1E1D318F0B5918D6387316B98136ACAF8.torrent?title=Tears-of-Steel-2012-2160p-6CH-x265-HEVC-PSA",
    seeds: 1,
    peers: 2,
    time: "1 Year+",
    size: "619.67 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-2160p-6CH-x265-HEVC-PSA-torrent-6181309.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel (2012) Sci-Fi BR2DVD DD2.0 NL Subs",
    link:
      "http://itorrents.org/torrent/1EF2640A24086AE02E3F5BAB423580E4C1C27DE6.torrent?title=Tears-of-Steel-(2012)-Sci-Fi-BR2DVD-DD2 0-NL-Subs",
    seeds: 1,
    peers: 0,
    time: "1 Year+",
    size: "685.51 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-(2012)-Sci-Fi-BR2DVD-DD2%200-NL-Subs-torrent-1527449.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel (2012) 720p Sci-Fi AAC 2.0 NL Subs",
    link:
      "http://itorrents.org/torrent/DC590C39A206F0AD6CBD9CF11FC8C31F792AA759.torrent?title=Tears-of-Steel-(2012)-720p-Sci-Fi-AAC-2 0-NL-Subs",
    seeds: 1,
    peers: 0,
    time: "1 Year+",
    size: "364.42 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-(2012)-720p-Sci-Fi-AAC-2%200-NL-Subs-torrent-1527661.html",
    provider: "Limetorrents",
  },
  {
    title: "Annadefka - Tears of Steel (2017)",
    link:
      "http://itorrents.org/torrent/8F9D998EA12BE639BC030C59139B65DAB9AADDF9.torrent?title=Annadefka--Tears-of-Steel-(2017)",
    seeds: 1,
    peers: 1,
    time: "1 Year+",
    size: "103.73 MB",
    desc:
      "https://www.limetorrents.info/Annadefka--Tears-of-Steel-(2017)-torrent-12024796.html",
    provider: "Limetorrents",
  },
  {
    title: "Ð¡Ð»ÐµÐ·Ñ‹ Ð¡Ñ‚Ð°Ð»Ð¸ Tears of Steel (2012) BDRip 1080p",
    link:
      "http://itorrents.org/torrent/11B53B855B1487947276FB9C95F43085EA942AB1.torrent?title=Ð¡Ð»ÐµÐ·Ñ‹-Ð¡Ñ‚Ð°Ð»Ð¸--Tears-of-Steel-(2012)-BDRip-1080p",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "617.88 MB",
    desc:
      "https://www.limetorrents.info/Ð¡Ð»ÐµÐ·Ñ‹-Ð¡Ñ‚Ð°Ð»Ð¸--Tears-of-Steel-(2012)-BDRip-1080p-torrent-1516625.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel[SHORT] 2012 BRRip AC3 XViD-RemixHD {RGDT}",
    link:
      "http://itorrents.org/torrent/93572BE0B4C4077A129554D996474348045FC64A.torrent?title=Tears-of-Steel[SHORT]-2012-BRRip-AC3-XViD-RemixHD- RGDT ",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "214.08 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel[SHORT]-2012-BRRip-AC3-XViD-RemixHD-%20RGDT%20-torrent-3099635.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel 2012 SWESUB AC3 BRRip XviD-Tankafett tv",
    link:
      "http://itorrents.org/torrent/3931349F90B28D03995F25941CA61A187541BD85.torrent?title=Tears-of-Steel-2012-SWESUB-AC3-BRRip-XviD-Tankafett-tv",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "428.54 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-SWESUB-AC3-BRRip-XviD-Tankafett-tv-torrent-1588576.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel 2012 PRPOER SWESUB AC3 BRRip XviD-Tankafett tv",
    link:
      "http://itorrents.org/torrent/A6E1A5B5CAAD509C1D5F0FB6B0202087E5787547.torrent?title=Tears-of-Steel-2012-PRPOER-SWESUB-AC3-BRRip-XviD-Tankafett-tv",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "428.54 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-PRPOER-SWESUB-AC3-BRRip-XviD-Tankafett-tv-torrent-1589578.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel 2012 HDRip",
    link:
      "http://itorrents.org/torrent/B9F0C289E7EE1B8612EA8D68610853A5D1277131.torrent?title=Tears-of-Steel-2012-HDRip",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "255 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-HDRip-torrent-1613994.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel 2012 4K [3840x1714] x264 anoXmous",
    link:
      "http://itorrents.org/torrent/1732C76718B1FD038885B64BFE690030D9A904AB.torrent?title=Tears-of-Steel-2012-4K-[3840x1714]-x264-anoXmous",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "4.39 GB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-4K-[3840x1714]-x264-anoXmous-torrent-3257029.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel 2012 2160p DMRip Eng HDCL mp4",
    link:
      "http://itorrents.org/torrent/AA59289941FAA6563A7868B1DF06D84924ED8F0B.torrent?title=Tears-of-Steel-2012-2160p-DMRip-Eng-HDCL-mp4",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "368.69 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-2160p-DMRip-Eng-HDCL-mp4-torrent-6384214.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel 2012 2160p DM DD5 1 x264-DON",
    link:
      "http://itorrents.org/torrent/A5844EDA9826538C12700C012D1F754731E74D08.torrent?title=Tears-of-Steel-2012-2160p-DM-DD5-1-x264-DON",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "12.31 GB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-2160p-DM-DD5-1-x264-DON-torrent-3793347.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel 2012 (Short-Film) 50MB BDRip 480p ~JMX~ Ganool",
    link:
      "http://itorrents.org/torrent/E91242FB72DFFEF303511F4166E716AB61C24930.torrent?title=Tears-of-Steel-2012-(Short-Film)-50MB-BDRip-480p- JMX -Ganool",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "54.03 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-2012-(Short-Film)-50MB-BDRip-480p-%20JMX%20-Ganool-torrent-1521239.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel (2012)(dvd5)(Nl Subs)(BR2DVD) SAM TBS",
    link:
      "http://itorrents.org/torrent/9CDF98B58A5B9E13574347249C1C991DB51881D1.torrent?title=Tears-of-Steel-(2012)(dvd5)(Nl-Subs)(BR2DVD)-SAM-TBS",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "685.68 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-(2012)(dvd5)(Nl-Subs)(BR2DVD)-SAM-TBS-torrent-2978213.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel (2012) mp4",
    link:
      "http://itorrents.org/torrent/79304FBAD35141CB60E7192F3D80E2954C160507.torrent?title=Tears-of-Steel-(2012)-mp4",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "276.88 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-(2012)-mp4-torrent-8042794.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel (2012) BDRip(WWWWIDE COM) 480p mkv",
    link:
      "http://itorrents.org/torrent/A6B08D767E944BB6A86A5531D29616586C19FDC3.torrent?title=Tears-of-Steel-(2012)-BDRip(WWWWIDE-COM)-480p-mkv",
    seeds: 0,
    peers: 7,
    time: "1 Year+",
    size: "54.11 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-(2012)-BDRip(WWWWIDE-COM)-480p-mkv-torrent-1662901.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel (2012) 720p mkv",
    link:
      "http://itorrents.org/torrent/5A3A3D0084D338526714F21867C874BF4E703E52.torrent?title=Tears-of-Steel-(2012)-720p-mkv",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "364.77 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-(2012)-720p-mkv-torrent-1517065.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel (2012) 2160p DMRip x264 AC3 - ABI",
    link:
      "http://itorrents.org/torrent/A60A1AA48D7BD892425B2AEE175A949212C39ECC.torrent?title=Tears-of-Steel-(2012)-2160p-DMRip-x264-AC3--ABI",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "1.53 GB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-(2012)-2160p-DMRip-x264-AC3--ABI-torrent-8704084.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel (2012) - HD 720p - mkv",
    link:
      "http://itorrents.org/torrent/89BF571C58412E9110A597A404F159993D603FA6.torrent?title=Tears-of-Steel-(2012)--HD-720p--mkv",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "364.8 MB",
    desc:
      "https://www.limetorrents.info/Tears-of-Steel-(2012)--HD-720p--mkv-torrent-5776307.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears of Steel",
    link:
      "http://itorrents.org/torrent/209C8226B299B308BEAF2B9CD3FB49212DBD13EC.torrent?title=Tears-of-Steel",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "544.95 MB",
    desc: "https://www.limetorrents.info/Tears-of-Steel-torrent-10644528.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears Of Steel 2012 BRRip 240p All Mobile (T Media)",
    link:
      "http://itorrents.org/torrent/093326CC5694505CF8F30206E1C54E1F041D2A9C.torrent?title=Tears-Of-Steel-2012-BRRip-240p-All-Mobile-(T-Media)",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "20.5 MB",
    desc:
      "https://www.limetorrents.info/Tears-Of-Steel-2012-BRRip-240p-All-Mobile-(T-Media)-torrent-4340888.html",
    provider: "Limetorrents",
  },
  {
    title: "Tears Of Steel (2012) 1080p x264 AAC-WiNNy",
    link:
      "http://itorrents.org/torrent/79C8E6E28E89514816200AD2CC74BB2F26988E6E.torrent?title=Tears-Of-Steel-(2012)-1080p-x264-AAC-WiNNy",
    seeds: 0,
    peers: 0,
    time: "1 Year+",
    size: "959.73 MB",
    desc:
      "https://www.limetorrents.info/Tears-Of-Steel-(2012)-1080p-x264-AAC-WiNNy-torrent-3790678.html",
    provider: "Limetorrents",
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
