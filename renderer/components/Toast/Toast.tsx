import React, { memo, useEffect, useState } from "react";
import { animated, config } from "react-spring";
import { fadeInTranslateY } from "@utils/animations";
import styles from "./Toast.module.scss";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import mitt from "mitt";

const emitter: mitt.Emitter = mitt();

export const Toast = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    emitter.on("SHOW_TOAST", (message) => {
      setMessage(message);
      setShow(true);

      setTimeout(() => setShow(false), 10000);
    });
  }, []);

  const transitions = fadeInTranslateY(show, {
    config: config.wobbly,
  });

  return (
    <>
      {transitions.map(
        ({ item, props, key }) =>
          item && (
            <animated.div className={styles.toast} key={key} style={props}>
              {message}

              <Icon
                onClick={() => setShow(null)}
                style={{ marginLeft: 10 }}
                path={mdiClose}
                color="#fff"
                size={0.8}
              />
            </animated.div>
          )
      )}
    </>
  );
};

export const showToast = (msg: string) => {
  emitter.emit("SHOW_TOAST", msg);
};
