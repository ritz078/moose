import { SpringConfig, State, useTransition } from "react-spring";

export const config: any = (_a, motion: State) =>
  motion === "leave" ? { duration: 0.1 } : { duration: 200 };

export function fadeInTranslateY(
  item: boolean,
  translateX: string | number = 0,
  keys = null,
  config?
) {
  return useTransition(item, keys, {
    from: {
      opacity: 0,
      transform: `translateY(5px) translateX(${translateX})`,
    },
    enter: {
      opacity: 1,
      transform: `translateY(0px) translateX(${translateX})`,
    },
    leave: {
      opacity: 0,
      transform: `translateY(5px) translateX(${translateX})`,
    },
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
