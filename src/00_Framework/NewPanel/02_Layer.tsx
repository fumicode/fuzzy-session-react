import { FC, useEffect } from "react";
import styled from "styled-components";
import React from "react";

interface LayerProps {
  //string: テキトーな型
  className?: string;
  zIndex?: number;
  children?: React.ReactNode;
}

export const Layer: FC<LayerProps> = styled(
  ({ className, children, zIndex }: LayerProps) => {
    //本当はまだいらないかもしれない
    const layerRef = React.useRef<HTMLDivElement>(null);
    const [rect, setRect] = React.useState<DOMRectReadOnly | undefined>(
      undefined
    );

    useEffect(() => {
      const layer = layerRef.current;
      if (!layer) {
        throw new Error("panel not found");
      }
      setRect(layer.getBoundingClientRect());
    }, []); //TODOあとで最適化

    return (
      <div className={className} ref={layerRef} style={{ zIndex }}>
        <p>{rect && JSON.stringify(rect, null, "  ")}</p>
        {children}
      </div>
    );
  }
)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;

  min-height: 100%;

  overflow: hidden;

  pointer-events: none;

  transform: scale(${(props) => ((props.zIndex || 0) / 3) * 0.5 + 0.5});

  transition: transform 0.1s ease-in-out;

  .e-window {
    display: contents;
    background: #eee;
  }

  &:nth-child(1) {
    background: hsla(0, 50%, 50%, 0.5);
  }
  &:nth-child(2) {
    background: hsla(60, 50%, 50%, 0.5);
  }
  &:nth-child(3) {
    background: hsla(120, 50%, 50%, 0.5);
  }
`;

export default Layer;
