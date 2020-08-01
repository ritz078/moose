import { Download } from "@components/Downloads";
import Swal from "sweetalert2/dist/sweetalert2";
import parseTorrent from "parse-torrent";
import MagnetUri from "magnet-uri";

export async function handleMagnetSelect(
  onFileSelect: (info: Download) => void
) {
  const { value } = await Swal.fire({
    title: "Enter your Magnet URL",
    input: "text",
    showCancelButton: true,
    inputValidator: (value) => {
      try {
        parseTorrent(value);
      } catch (e) {
        return e.message;
      }
    },
  });

  if (value) {
    const { name, infoHash }: MagnetUri.Instance = parseTorrent(value);
    onFileSelect({
      name: name as string,
      infoHash,
      magnet: value,
    });
  }
}
