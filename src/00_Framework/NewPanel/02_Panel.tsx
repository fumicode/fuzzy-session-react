import { FC } from "react";
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

  parentSize?: Size2;

  zIndex?: number;

  children?: React.ReactNode;

  onPanelChange(smartRect: SmartRect): void;

  onChildOpen(smartRect: SmartRect): void;
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
  }: PanelProps) => {
    return (
      <article className={className} style={{ zIndex: z }}>
        <header className="e-header">
          <h1 className="e-title">Panel 1: {name}</h1>
        </header>
        <div
          className="e-body"
          style={{ background: `hsla(0,0%,${40 + 40}%)` }}
        >
          <p>hello</p>
          <p>props position: {JSON.stringify(position)}</p>
          {children}
          <button onClick={() => {}}>Open Child</button>

          <table>
            <tbody>
              <tr>
                <td>◀</td>
                <td>↑</td>
                <td>▲</td>
              </tr>
              <tr>
                <td>←</td>
                <td></td>
                <td>→</td>
              </tr>
              <tr>
                <td>▼</td>
                <td>↓</td>
                <td>▶</td>
              </tr>
            </tbody>
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
    transition: background 0.9s;
    p {
      margin: 0;
    }
  }
`;

export default Panel;
