import { State, useTransition } from "react-spring";

export function fadeIn(item: boolean, translateX: string | number = 0) {
  return useTransition(item, null, {
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
    // @ts-ignore
    config: (_a, motion: State) =>
      motion === "leave" ? { duration: 0.1 } : { duration: 200 },
  });
}
