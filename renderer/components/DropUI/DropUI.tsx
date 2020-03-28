import React, { memo } from "react";
import { ViewState } from "@components/enums/ViewState";
import Icon from "@mdi/react";
import { mdiFileDownload } from "@mdi/js";
import styles from "./DropUI.module.scss";
import cn from "classnames";
import { useTransition, animated } from "react-spring";

interface IProps {
  viewState: ViewState;
  isDragActive: boolean;
}

export const DropUI: React.FC<IProps> = memo(({ viewState, isDragActive }) => {
  const transitions = useTransition(
    viewState === ViewState.DOWNLOADS || isDragActive,
    null,
    {
      enter: { opacity: 1 },
      leave: { opacity: 0, pointerEvents: "none" },
    }
  );

  return (
    <>
      {transitions.map(
        ({ item, props, key }) =>
          item && (
            <animated.div
              key={key}
              className={cn(styles.zeroResultsWrapper, {
                [styles.zrwActive]: isDragActive,
                [styles.zrwSearch]: viewState === ViewState.SEARCH,
              })}
              style={props}
            >
              <Icon
                path={mdiFileDownload}
                size={3}
                title="Drag and drop torrent file"
              />
            </animated.div>
          )
      )}
    </>
  );
});
