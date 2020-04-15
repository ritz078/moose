declare module "@mdi/react" {
  import { FunctionComponent, SVGProps } from "react";
  import { IconProps } from "@mdi/react/dist/IconProps";

  type _IconProps = IconProps & SVGProps<HTMLOrSVGElement>;

  export declare const Icon: FunctionComponent<_IconProps>;
  export default Icon;
}

declare const BROWSER: boolean;
declare const FETCH_SUBTITLES: boolean;
declare const DEV: boolean;
