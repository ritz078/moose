import Store from "electron-store";
import { name, version } from "../../package.json";
import { remote, app } from "electron";
import { getDefaultColor } from "@utils/theme";

const store = new Store({
  name,
  // @ts-ignore
  projectVersion: version,
  defaults: {
    torrents: [],
    descriptions: {},
    color: getDefaultColor(),
    downloadDirectory: (app || remote.app).getPath("downloads"),
    wasDarkMode: remote.nativeTheme.shouldUseDarkColors,
  },
  migrations: {
    "0.4.0": (store) => store.reset("color"),
  },
});

export default store;
