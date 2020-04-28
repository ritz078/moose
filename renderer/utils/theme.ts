import { remote } from "electron";

export function getDefaultColor() {
  return remote.nativeTheme.shouldUseDarkColors ? "rgba(0,0,0,0)" : "#3e3e3e";
}
