import { FC, RefObject, forwardRef, useEffect, useRef } from "react";
import styled from "styled-components";
import React from "react";
import SmartRect from "./01_SmartRect";
import { Point2, Size2 } from "../../01_Utils/00_Point";
import useGetSmartRect from "./01_useGetSmartRect";
import classNames from "classnames";
import { Transition, TransitionStatus } from "react-transition-group";
import { CharactorId, CharactorRelation } from "./20_Charactor";

interface PanelProps {
  //string: テキトーな型
  className?: string;

  charactorId: CharactorId;

  title: string;
  charactorRelations: CharactorRelation[];

  position: Point2;

  size: Size2;

  parentSize: Size2;

  zIndex?: number;
  colorHue?: number;
  isActive: boolean;

  children?: React.ReactNode;

  transitionState: TransitionStatus;

  onMove(smartRect: SmartRect): void;
  onRelationOpen(smartRect: SmartRect, id: string): void;
}

const duration = 1000;
export const Panel = styled(
  forwardRef<HTMLDivElement, PanelProps>(
    (
      {
        className,
        charactorId,
        title: name,
        charactorRelations,

        position,
        size,
        parentSize,

        zIndex: z,
        colorHue,

        children,

        transitionState,

        onMove,
        onRelationOpen,
      }: PanelProps,
      panelRef
    ) => {
      const renderedRect = useGetSmartRect(
        position,
        parentSize,
        panelRef as RefObject<HTMLDivElement>,
        transitionState,
        onMove
      );

      const spaceWidestDirection = renderedRect?.calcSpaceWideDirection();

      const defaultStyle = {
        transition: `left ${duration}ms ease-in-out,
          top ${duration}ms ease-in-out, 
          width ${duration}ms ease-in-out, 
          height ${duration}ms ease-in-out, 
          opacity ${duration}ms ease-in-out`,
        opacity: 0,
      };

      const transitionStyles: Record<TransitionStatus, React.CSSProperties> = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0.5 },
        exited: { opacity: 0.5 },
        unmounted: { opacity: 0.5 },
      };

      return (
        <article
          className={className}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: `${size.height}px`,
            ...defaultStyle,
            ...transitionStyles[transitionState],
          }}
          ref={panelRef}
        >
          <header className="e-header">
            <h2 className="e-title">
              #{charactorId} {name}
            </h2>
          </header>
          <div
            className="e-body"
            style={{ background: `hsl(${colorHue}, 50%, 50%)` }}
          >
            {children}

            {charactorRelations.map((relation) => {
              return (
                <button
                  onClick={() => {
                    if (!renderedRect) {
                      return;
                    }

                    onRelationOpen(renderedRect, relation.target.id);
                  }}
                  key={relation.target.id}
                >
                  {relation.relation}:{relation.target.name}
                </button>
              );
            })}

            {renderedRect ? (
              <table>
                <tbody>
                  <tr>
                    <td
                      className={classNames({
                        "m-widest": spaceWidestDirection === "left",
                      })}
                    >
                      ◀{Math.floor(renderedRect.leftSpace)}
                    </td>
                    <td>↑{Math.floor(renderedRect.top)}</td>
                    <td
                      className={classNames({
                        "m-widest": spaceWidestDirection === "top",
                      })}
                    >
                      ▲{Math.floor(renderedRect.topSpace)}
                    </td>
                  </tr>
                  <tr>
                    <td>←{Math.floor(renderedRect.left)}</td>
                    <td></td>
                    <td>{Math.floor(renderedRect.right)}→</td>
                  </tr>
                  <tr>
                    <td
                      className={classNames({
                        "m-widest": spaceWidestDirection === "bottom",
                      })}
                    >
                      ▼{Math.floor(renderedRect.bottomSpace)}
                    </td>
                    <td>↓{Math.floor(renderedRect.bottom)}</td>
                    <td
                      className={classNames({
                        "m-widest": spaceWidestDirection === "right",
                      })}
                    >
                      {Math.floor(renderedRect.rightSpace)}▶
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              //チラツクけどいったんおいておく
              <p style={{ background: "red" }}>no rect yet</p>
            )}
          </div>
        </article>
      );
    }
  )
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

    td {
      &.m-widest {
        color: red;
      }
    }
  }
`;

type PanelPropsWithoutRef = Omit<PanelProps, "forwardRef" | "transitionState">;
export const ProxyPanel: FC<PanelPropsWithoutRef> = (
  props: PanelPropsWithoutRef
) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const isActive = props.isActive;

  return (
    <Transition nodeRef={panelRef} in={isActive} timeout={duration}>
      {(state) => <Panel {...props} ref={panelRef} transitionState={state} />}
    </Transition>
  );
};

export default ProxyPanel;
