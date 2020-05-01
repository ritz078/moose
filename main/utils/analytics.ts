import ua from "universal-analytics";
import Store from "electron-store";
import { v4 } from "uuid";
import logger from "electron-log";
import { version } from "../../package.json";

const store = new Store({
  name: "appInfo",
  defaults: {
    userId: v4(),
  },
});

const visitor = ua(UA_ID, store.get("userId"));
visitor.set("version", version);
visitor.set("platform", process.platform);

// moose currently keeps track of the number of apps installed.
// No data of yours is tracked or sent to the server. If in future, there
// is any additional tracking, there will be an option to turn that off in setting.
visitor.pageview("/", logger.info);
