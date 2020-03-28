import Electron from "electron"
const remote = Electron.remote;

export * from "./Header";

const x = remote.require("../../mainModules/a")
console.log(x)
