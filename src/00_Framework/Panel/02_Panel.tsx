import { FC, useEffect } from "react";
import styled from "styled-components";
import ViewModel from "../00_ViewModel";
import React from "react";
import { log } from "console";
import SmartRect from "./01_SmartRect";

interface PanelProps {
  //string: テキトーな型
  className?: string;
  title: string;

  x: number;
  y: number;

  width: number;
  height: number;

  parentWidth?: number;
  parentHeight?: number;

  children?: React.ReactNode;

  onPanelChange(smartRect: SmartRect): void;
}

export const Panel: FC<PanelProps> = styled(
  ({
    className,
    title: name,

    parentWidth,
    parentHeight,

    children,

    onPanelChange,
  }: PanelProps) => {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const [rect, setRect] = React.useState<DOMRectReadOnly | undefined>(
      undefined
    );

    const smartRect =
      rect &&
      parentWidth &&
      parentHeight &&
      new SmartRect(rect, {
        width: parentWidth,
        height: parentHeight,
      });

    useEffect(() => {
      const panel = panelRef.current;
      if (!panel) {
        console.log("panel not found");

        return;
      }

      if (parentWidth === undefined || parentHeight === undefined) {
        throw new Error("parentWidth or parentHeight is undefined");
      }

      setRect(panel.getBoundingClientRect());

      const smartRect = new SmartRect(panel.getBoundingClientRect(), {
        width: parentWidth,
        height: parentHeight,
      });

      onPanelChange(smartRect);
    }, [
      rect?.x,
      rect?.y,
      rect?.width,
      rect?.height,
      parentHeight,
      parentWidth,
    ]);

    return (
      <article className={className} ref={panelRef}>
        <header className="e-header">
          <h1 className="e-title">Panel 1: {name}</h1>
        </header>
        <div className="e-body">
          <p>{rect && JSON.stringify(rect, null, "  ")}</p>
          {children}
        </div>
      </article>
    );
  }
)`
  position: absolute;
  background: white;

  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;

  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;

  display: flex;
  flex-direction: column;

  > .e-header {
    //flex-basis: 0;
    flex-grow: 0;
    flex-shrink: 0;

    cursor: move;
    //選択させない
    user-select: none;

    > .e-title {
      margin: 0;
      padding: 0;
      line-height: 1;
    }
  }

  > .e-body {
    //flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1;

    background: red;

    overflow: scroll;
    p {
      margin: 0;
    }
  }
`;

export default Panel;
