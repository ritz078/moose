import Store from "electron-store";
import { name } from "../../package.json";
import { sampleMagnets } from "../../sample/results";
import { remote, app } from "electron";

const store = new Store({
  name,
  defaults: {
    torrents: sampleMagnets,
    descriptions: {},
    color: "rgba(0,0,0,0)",
    downloadDirectory: (app || remote.app).getPath("downloads"),
  },
});

export default store;
