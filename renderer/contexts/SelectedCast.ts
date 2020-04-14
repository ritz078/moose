import React from "react";

interface Context {
  selectedCast: string;
  setSelectedCast: (file: Context["selectedCast"]) => void;
}

export const SelectedCastContext = React.createContext<Context>({
  selectedCast: null,
  setSelectedCast: () => {},
});
