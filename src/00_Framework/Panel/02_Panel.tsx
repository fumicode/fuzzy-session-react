import { FC, useEffect } from "react";
import styled from "styled-components";
import ViewModel from "../00_ViewModel";
import React from "react";
import { log } from "console";
import SmartRect from "./01_SmartRect";
import { Point2, Size2 } from "../00_Point";

interface PanelProps {
  //string: テキトーな型
  className?: string;
  title: string;

  position: Point2;

  size: Size2;

  parentSize?: Size2;

  children?: React.ReactNode;

  onPanelChange(smartRect: SmartRect): void;

  onChildOpen(smartRect: SmartRect): void;
}

export const Panel: FC<PanelProps> = styled(
  ({
    className,
    title: name,

    parentSize,

    children,

    onPanelChange,
    onChildOpen,
  }: PanelProps) => {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const [rect, setRect] = React.useState<DOMRectReadOnly | undefined>(
      undefined
    );

    const smartRect =
      rect &&
      parentSize &&
      new SmartRect(rect, {
        width: parentSize.width,
        height: parentSize.height,
      });

    useEffect(() => {
      const panel = panelRef.current;
      if (!panel) {
        console.log("panel not found");

        return;
      }

      if (
        !parentSize ||
        parentSize?.width === undefined ||
        parentSize?.height === undefined
      ) {
        throw new Error("parentWidth or parentHeight is undefined");
      }

      setRect(panel.getBoundingClientRect());

      const smartRect = new SmartRect(
        panel.getBoundingClientRect(),
        parentSize
      );

      onPanelChange(smartRect);
    }, [
      rect?.x,
      rect?.y,
      rect?.width,
      rect?.height,
      parentSize?.width,
      parentSize?.height,
    ]);

    return (
      <article className={className} ref={panelRef}>
        <header className="e-header">
          <h1 className="e-title">Panel 1: {name}</h1>
        </header>
        <div className="e-body">
          <p>{rect && JSON.stringify(rect, null, "  ")}</p>
          {children}
          <button
            onClick={() => {
              if (!smartRect) {
                return;
              }

              onChildOpen(smartRect);
            }}
          >
            Open Child
          </button>

          <table>
            <tr>
              <td>◀{smartRect?.leftSpace}</td>
              <td>↑{smartRect?.top}</td>
              <td>▲{smartRect?.topSpace}</td>
            </tr>
            <tr>
              <td>←{smartRect?.left}</td>
              <td></td>
              <td>{smartRect?.right}→</td>
            </tr>
            <tr>
              <td>▼{smartRect?.bottomSpace}</td>
              <td>↓{smartRect?.bottom}</td>
              <td>{smartRect?.rightSpace}▶</td>
            </tr>
          </table>
        </div>
      </article>
    );
  }
)`
  position: absolute;
  background: white;

  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;

  width: ${(props) => props.size.width}px;
  height: ${(props) => props.size.height}px;

  display: flex;
  flex-direction: column;

  transition: left 0.3s, top 0.3s, width 0.3s, height 0.3s;

  pointer-events: auto;
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

    overflow: scroll;
    p {
      margin: 0;
    }
  }
`;

export default Panel;
