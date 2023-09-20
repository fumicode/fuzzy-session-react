import { FC, RefObject, useEffect } from "react";
import styled from "styled-components";
import React from "react";
import SmartRect from "./01_SmartRect";
import { Point2, Size2 } from "../00_Point";

interface PanelProps {
  //string: テキトーな型
  className?: string;
  title: string;

  position: Point2;

  size: Size2;

  parentSize: Size2;

  zIndex?: number;

  children?: React.ReactNode;

  onPanelChange(smartRect: SmartRect): void;

  onChildOpen(smartRect: SmartRect): void;

  counter: number;
}

const useGetSmartRect = (
  position: Point2,
  parentSize: Size2
): { renderedRect: SmartRect | undefined; ref: RefObject<HTMLDivElement> } => {
  const [renderedRect, setRenderedRect] = React.useState<SmartRect | undefined>(
    undefined
  );

  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("useEffect");
    console.log(ref.current);
    const panelEl = ref.current;
    if (panelEl === null) {
      return;
    }

    console.log(panelEl.getBoundingClientRect());
    const rect = panelEl.getBoundingClientRect();
    const smartRect = new SmartRect(rect, parentSize);
    setRenderedRect(smartRect);
  }, [position]);

  return {
    renderedRect,
    ref,
  };
};

export const Panel: FC<PanelProps> = styled(
  ({
    className,
    title: name,

    position,
    size,
    parentSize,

    zIndex: z,

    children,

    onPanelChange,
    onChildOpen,

    counter,
  }: PanelProps) => {
    console.log("render");

    const { renderedRect, ref: panelRef } = useGetSmartRect(
      position,
      parentSize
    );

    return (
      <article
        className={className}
        style={{
          zIndex: z,
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
        ref={panelRef}
      >
        <header className="e-header">
          <h1 className="e-title">Panel 1: {name}</h1>
        </header>
        <div
          className="e-body"
          style={{ background: `hsla(0,0%,${40 + 40}%)` }}
        >
          {children}
          <button onClick={() => {}}>Open Child</button>

          {renderedRect ? (
            <table>
              <tr>
                <td>◀{renderedRect.leftSpace}</td>
                <td>↑{renderedRect.top}</td>
                <td>▲{renderedRect.topSpace}</td>
              </tr>
              <tr>
                <td>←{renderedRect.left}</td>
                <td></td>
                <td>{renderedRect.right}→</td>
              </tr>
              <tr>
                <td>▼{renderedRect.bottomSpace}</td>
                <td>↓{renderedRect.bottom}</td>
                <td>{renderedRect.rightSpace}▶</td>
              </tr>
            </table>
          ) : (
            <p style={{ background: "red" }}>no rect yet</p>
          )}
        </div>

        <footer className="e-footer">counter: {counter}</footer>
      </article>
    );
  }
)`
  position: absolute;
  background: white;

  display: flex;
  flex-direction: column;

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
    transition: background 0.9s;
    p {
      margin: 0;
    }
  }
`;

export default Panel;
