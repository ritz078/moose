import React from "react";
import { CastDevice } from "@components/Cast/Cast";

export interface Context {
  selectedCast: CastDevice;
  setSelectedCast: (file: Context["selectedCast"]) => void;
}

export const SelectedCastContext = React.createContext<Context>({
  selectedCast: null,
  setSelectedCast: () => {},
});
