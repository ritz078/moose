import React, { useEffect, useRef, useState } from "react";
import { animated, useTransition } from "react-spring";
import ReactDom from "react-dom";
import cn from "classnames";
import styles from "./Modal.module.scss";

interface IProps {
  show: boolean;
  onCloseRequest: () => void;
  fullScreen?: boolean;
}

export const Modal: React.FC<IProps> = ({
  show,
  children,
  onCloseRequest,
  fullScreen,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    divRef.current = document.createElement("div");
    document.body.appendChild(divRef.current);

    return () => {
      document.body.removeChild(divRef.current);
    };
  }, []);

  useEffect(() => {
    function closePlayer(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCloseRequest();
      }
    }

    document.addEventListener("keydown", closePlayer);

    return () => {
      document.removeEventListener("keydown", closePlayer);
    };
  }, [show]);

  const transitions = useTransition(show, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    isMounted &&
    ReactDom.createPortal(
      transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              style={props}
              key={key}
              className={cn(styles.modal, {
                fullScreen,
              })}
            >
              {children}
            </animated.div>
          )
      ),
      divRef.current
    )
  );
};
