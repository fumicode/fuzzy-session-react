import { FC, RefObject, forwardRef, useEffect, useRef } from "react";
import styled from "styled-components";
import React from "react";
import SmartRect, { SmartRectView } from "./01_SmartRect";
import { Point2, Size2 } from "../../01_Utils/00_Point";
import useGetSmartRect from "./01_useGetSmartRect";
import { Transition, TransitionStatus } from "react-transition-group";
import { on } from "events";

interface PanelProps {
  //string: テキトーな型
  className?: string;

  position: Point2;

  size: Size2;

  parentSize: Size2; //ない場合には描画されない

  zIndex?: number;
  isActive: boolean;
  bgColor?: string;

  children: (renderedRect: SmartRect) => React.ReactNode;

  transitionState: TransitionStatus;

  onMove(smartRect: SmartRect): void;
  onPanelClick?(): void;

  debugMode?: boolean;
}

const duration = 1000;
export const Panel = styled(
  forwardRef<HTMLDivElement, PanelProps>(
    (
      {
        className,
        position,
        size,
        parentSize,
        children,
        transitionState,
        zIndex,
        onMove,
        onPanelClick,
        debugMode,
      }: PanelProps,
      panelRef
    ) => {
      debugMode = debugMode || false;

      const renderedRect = useGetSmartRect(
        position,
        parentSize,
        panelRef as RefObject<HTMLDivElement>,
        transitionState,
        onMove
      );

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
        exiting: { opacity: 0.9 },
        exited: { opacity: 0.9 },
        unmounted: { opacity: 0.9 },
      };

      return (
        <div
          className={className}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: `${size.height}px`,
            zIndex: zIndex,
            ...defaultStyle,
            ...transitionStyles[transitionState],
          }}
          ref={panelRef}
          onClick={() => {
            onPanelClick && onPanelClick();
          }}
        >
          {renderedRect && children(renderedRect)}

          {debugMode && renderedRect && (
            <div className="e-rect-info">
              <SmartRectView main={renderedRect} className="e-smartRect" />
            </div>
          )}
        </div>
      );
    }
  )
)`
  position: absolute;
  background: ${({ bgColor }) => bgColor || "hsla(0, 0%, 0%, 0.1)"};
  box-shadow: 0 0 10px 3px hsla(0, 0%, 0%, 0.5);

  pointer-events: auto;
  overflow: auto;

  > .e-rect-info {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 100;
    pointer-events: none;
    opacity: 0.5;
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
