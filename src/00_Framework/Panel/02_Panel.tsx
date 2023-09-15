import { FC, RefObject, useCallback, useEffect } from "react";
import styled from "styled-components";
import ViewModel from "../00_ViewModel";
import React from "react";
import { log } from "console";
import SmartRect from "./01_SmartRect";
import { Point2, Size2 } from "../00_Point";

// 引数のtargetProperty をDOMRectのもつPropertyに限定する
type DOMRectProperty = keyof Omit<DOMRect, "toJSON">;

// RefObjectの型は div, span, p, input などのさまざまなHTML要素に対応できるようにextendsで制限をかけつつ抽象化
export const useGetElementProperty = <T extends HTMLElement>(
  elementRef: RefObject<T>
) => {
  const getElementProperty = useCallback(
    (targetProperty: DOMRectProperty): number => {
      const clientRect = elementRef.current?.getBoundingClientRect();
      if (clientRect) {
        return clientRect[targetProperty];
      }

      // clientRect が undefined のときはデフォルトで0を返すようにする
      return 0;
    },
    [elementRef]
  );

  return {
    getElementProperty,
  };
};

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
    const [phase, setPhase] = React.useState<0 | 1>(0);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const { getElementProperty } =
      useGetElementProperty<HTMLDivElement>(panelRef);

    const [rect, setRect] = React.useState<SmartRect | undefined>(undefined);

    const [zIndex, setZIndex] = React.useState<number>(z || 0);
    console.log(`render panel "${name}"`);

    console.log({ position });

    useEffect(() => {
      console.log("useEffect panel ref calc");

      if (phase === 1) {
        return;
      }
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

      /////
      console.log("parentSize", parentSize);

      const r = new SmartRect(panel.getBoundingClientRect(), parentSize);

      setRect(r);
      setZIndex(zIndex);
      setPhase(1);
      onPanelChange(r);
    }, [
      position,
      position.x,
      position.y,
      size.width,
      size.height,
      parentSize?.width,
      parentSize?.height,
      z,
      phase,
    ]);

    useEffect(() => {
      console.log("useEffect reset phase");
      setPhase(0);
    }, []);

    return (
      <article className={className} ref={panelRef} style={{ zIndex: z }}>
        <header className="e-header">
          <h1 className="e-title">
            Panel 1: {name} {phase}
          </h1>
        </header>
        <div
          className="e-body"
          style={{ background: `hsla(0,0%,${40 + phase * 40}%)` }}
        >
          <p>
            {getElementProperty("x") +
              " " +
              getElementProperty("y") +
              " " +
              getElementProperty("height") +
              " " +
              getElementProperty("width") +
              " " +
              getElementProperty("top") +
              " " +
              getElementProperty("right") +
              " " +
              getElementProperty("bottom") +
              " " +
              getElementProperty("left")}
          </p>
          <p>{JSON.stringify(position)}</p>
          <p>{rect && JSON.stringify(rect, null, "  ")}</p>
          {children}
          <button
            onClick={() => {
              if (!rect) {
                return;
              }

              onChildOpen(rect);
            }}
          >
            Open Child
          </button>

          <table>
            <tr>
              <td>◀{rect?.leftSpace}</td>
              <td>↑{rect?.top}</td>
              <td>▲{rect?.topSpace}</td>
            </tr>
            <tr>
              <td>←{rect?.left}</td>
              <td></td>
              <td>{rect?.right}→</td>
            </tr>
            <tr>
              <td>▼{rect?.bottomSpace}</td>
              <td>↓{rect?.bottom}</td>
              <td>{rect?.rightSpace}▶</td>
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
