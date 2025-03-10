import { HTMLProps } from "react";
import "./loading.css";

type Props = Omit<HTMLProps<SVGElement>, "ref">;

export function Loading(props: Props) {
  return (
    <svg id="dots" width="30" viewBox="0 0 132 58" version="1.1" {...props}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="dots" fill="currentColor">
          <circle id="dot1" cx="25" cy="30" r="13"></circle>
          <circle id="dot2" cx="65" cy="30" r="13"></circle>
          <circle id="dot3" cx="105" cy="30" r="13"></circle>
        </g>
      </g>
    </svg>
  );
}
