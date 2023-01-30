import { FC } from "react";

export enum Trigger {
  Hover = "hover",
  Click = "click",
  Touch = "touch",
}

export enum Position {
  Right = "right",
  Below = "below",
  Left = "left",
  Above = "above",
  Auto = "auto",
}

export interface ToolTipStyle extends React.CSSProperties {
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  animationDuration?: string;
}

export type ToolTipContent =
  | string
  | {
      type: "image" | "list";
      src: string;
      alt: string;
      items: string[];
    }
  | React.ReactElement;

interface ToolTipProps {
  position: Position;
  show: boolean;
  trigger: Trigger[];
  content: ToolTipContent;
  delay: number;
  style: ToolTipStyle;
  forceCenter: boolean;
  autoClose: boolean;
  children: React.ReactNode;
}

interface ToolTipRef {
  showDynamicToolTip: (hoverRect: ClientRect) => void;
  killDynamicToolTip: () => void;
  getNode: () => HTMLElement | null;
}

/**
 * ToolTip
 *
 * A tooltip component that can be positioned relative to its parent element.
 *
 * @author Fahis <fahis.skazi@gmail.com>
 * @version 1.0.8
 *
 * @example
 *
 * import ToolTip from './index'
 *
 * const Example = () => {
 *   return (
 *     <div>
 *       <ToolTip
 *         position="right"
 *         show={true}
 *         trigger="hover"
 *         content="This is some information in the tooltip"
 *         delay={1000}
 *         ref={ref}
 *       >
 *         <div>Hover over me</div>
 *       </ToolTip>
 *     </div>
 *   )
 * }
 */
declare const ToolTip: FC<ToolTipProps> & {
  forwardRef: (props: ToolTipProps, ref: ToolTipRef) => JSX.Element;
};

export default ToolTip;
