import Store from "electron-store";
import { name } from "../../package.json";
import { sampleMagnets } from "../../sample/results";
import { remote, app } from "electron";
import { getDefaultColor } from "@utils/theme";

const store: Store = new Store({
  name,
  defaults: {
    torrents: sampleMagnets,
    descriptions: {},
    color: getDefaultColor(),
    downloadDirectory: (app || remote.app).getPath("downloads"),
    wasDarkMode: remote.nativeTheme.shouldUseDarkColors,
  },
  migrations: {
    "0.4.1": (store) => store.reset("color"),
  },
});

export default store;
