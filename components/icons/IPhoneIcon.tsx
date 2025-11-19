import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export function IPhoneIcon({
  width = 32,
  height = 32,
  color = "#000000",
  ...props
}: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="-9.5 0 32 32" {...props}>
      <Path
        d="M2.375 4h8.281c1.313 0 2.375 1.063 2.375 2.375v19.25c0 1.313-1.063 2.375-2.375 2.375h-8.281c-1.313 0-2.375-1.063-2.375-2.375v-19.25c0-1.313 1.063-2.375 2.375-2.375zM1.531 23.281h9.969v-14.781h-9.969v14.781zM6.5 26.563c0.75 0 1.313-0.563 1.313-1.281 0-0.75-0.563-1.313-1.313-1.313-0.719 0-1.281 0.563-1.281 1.313 0 0.719 0.563 1.281 1.281 1.281z"
        fill={color}
      />
    </Svg>
  );
}
