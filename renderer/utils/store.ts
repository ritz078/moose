import Store from "electron-store";
import { name } from "../../package.json";
import { sampleMagnets } from "../../sample/results";
import { remote } from "electron";
console.log(remote);

const store = new Store({
  name,
  defaults: {
    torrents: sampleMagnets,
    descriptions: {},
    color: {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    },
  },
});

export default store;
