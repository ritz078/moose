import { State, useTransition } from "react-spring";
import { config } from "react-spring";

export const _config: any = (_a, motion: State) =>
  motion === "leave" ? { duration: 0.1 } : { duration: 200 };

export function fadeInTranslateY(
  item: boolean,
  opts?: {
    translateX?: string | number;
    keys?: any;
    config?: any;
    reverse?: boolean;
    onDestroyed?: any;
  }
) {
  const { config, keys, translateX, reverse, onDestroyed } = {
    ...{
      config: _config,
      keys: null,
      translateX: 0,
      reverse: false,
      onDestroyed: () => {},
    },
    ...opts,
  };

  const translateY = `${reverse ? -5 : 5}px`;
  return useTransition(item, keys, {
    from: {
      opacity: 0,
      transform: `translateY(${translateY}) translateX(${translateX})`,
    },
    enter: {
      opacity: 1,
      transform: `translateY(0px) translateX(${translateX})`,
    },
    leave: {
      opacity: 0,
      transform: `translateY(${translateY}) translateX(${translateX})`,
    },
    onDestroyed,
    config,
  });
}

export function fadeIn(item, keys) {
  return useTransition(item, keys, {
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    },
    // @ts-ignore
    config: (_a, motion: State) =>
      motion === "leave" ? { duration: 0.1 } : { duration: 300 },
  });
}

export function scale(item) {
  return useTransition(item, null, {
    from: { transform: "scale(0.5)", opacity: 0 },
    enter: { transform: "scale(1)", opacity: 1 },
    leave: { transform: "scale(0.5)", opacity: 0 },
    // @ts-ignore
    config: (_a, motion: State) =>
      motion === "leave" ? config.wobbly : { duration: 500 },
  });
}
