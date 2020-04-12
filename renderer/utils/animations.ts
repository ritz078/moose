import { useTransition } from "react-spring";

export function fadeIn(item: boolean) {
  return useTransition(item, null, {
    from: { opacity: 0, marginTop: 5 },
    enter: { opacity: 1, marginTop: 0 },
    leave: { opacity: 0, marginTop: 5 },
  });
}
