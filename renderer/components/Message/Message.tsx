import React from "react";
import { fadeInTranslateY } from "@utils/animations";
import { animated, useTransition } from "react-spring";
import styles from "./Message.module.scss";

interface IProps {
  show: boolean;
  message?: string;
}

export const Message: React.FC<IProps> = ({ show, message, children }) => {
  const transitions = fadeInTranslateY(show);

  return (
    <>
      {transitions.map(
        ({ item, props, key }) =>
          item && (
            <animated.div className={styles.success} style={props} key={key}>
              {message || children}
            </animated.div>
          )
      )}
    </>
  );
};
