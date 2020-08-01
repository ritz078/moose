import { remote } from "electron";
import { parseFileInfo } from "@utils/parseFileInfo";
import fs from "fs";
import { Download } from "@components/Downloads";

export async function handleFileSelect(onFileSelect: (info: Download) => void) {
  const { filePaths } = await remote.dialog.showOpenDialog(
    remote.getCurrentWindow(),
    {
      properties: ["openFile"],
      filters: [
        {
          name: "torrent",
          extensions: ["torrent"],
        },
      ],
      message: "Load Torrent File",
    }
  );

  if (filePaths.length) {
    const info = await parseFileInfo(fs.readFileSync(filePaths[0]));
    onFileSelect(info);
  }
}
