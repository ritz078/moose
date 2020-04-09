import React, { memo } from "react";
import Icon from "@mdi/react";
import { mdiFileDownload } from "@mdi/js";
import styles from "./DropUI.module.scss";
import cn from "classnames";
import { useTransition, animated, config } from "react-spring";

interface IProps {
  isDragActive: boolean;
}

export const DropUI: React.FC<IProps> = memo(({ isDragActive }) => {
  const transitions = useTransition(isDragActive, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0, pointerEvents: "none" },
    initial: null,
    config: config.stiff,
  });

  return (
    <>
      {transitions.map(
        ({ item, props, key }) =>
          item && (
            <animated.div
              key={key}
              className={cn(styles.zeroResultsWrapper, {
                [styles.zrwActive]: isDragActive,
                [styles.zrwSearch]: true,
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
