import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export function HomeIcon({ width = 32, height = 32, color = '#000000', ...props }: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0L0 6V8H1V15H4V10H7V15H15V8H16V6L14 4.5V1H11V2.25L8 0ZM9 10H12V13H9V10Z"
        fill={color}
      />
    </Svg>
  );
}
