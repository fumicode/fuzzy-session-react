import { FC, RefObject, useEffect } from "react";
import styled from "styled-components";
import React from "react";
import SmartRect from "./01_SmartRect";
import { Point2, Size2 } from "../../01_Utils/00_Point";
import useGetSmartRect from "./01_useGetSmartRect";

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
                <td>◀{Math.floor(renderedRect.leftSpace)}</td>
                <td>↑{Math.floor(renderedRect.top)}</td>
                <td>▲{Math.floor(renderedRect.topSpace)}</td>
              </tr>
              <tr>
                <td>←{Math.floor(renderedRect.left)}</td>
                <td></td>
                <td>{Math.floor(renderedRect.right)}→</td>
              </tr>
              <tr>
                <td>▼{Math.floor(renderedRect.bottomSpace)}</td>
                <td>↓{Math.floor(renderedRect.bottom)}</td>
                <td>{Math.floor(renderedRect.rightSpace)}▶</td>
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
