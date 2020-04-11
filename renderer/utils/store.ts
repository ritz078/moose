import Store from "electron-store";
import { name } from "../../package.json";
import { sampleMagnets } from "../../sample/results";

const store = new Store({
  name,
  defaults: {
    torrents: sampleMagnets,
    descriptions: {},
  },
});

export default store;
