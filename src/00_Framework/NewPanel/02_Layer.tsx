import { FC, useEffect } from "react";
import styled from "styled-components";
import React from "react";

interface LayerProps {
  //string: テキトーな型
  className?: string;
  zIndex?: number;
  colorHue: number;
  children?: React.ReactNode;
}

export const Layer: FC<LayerProps> = styled(
  ({ className, zIndex, children }: LayerProps) => {
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

  pointer-events: none;

  transform: scale(${(props) => ((props.zIndex || 0) / 3) * 0.2 + 0.8});

  transition: transform 0.1s ease-in-out;

  .e-window {
    display: contents;
    background: #eee;
  }

  background: hsla(${(props) => props.colorHue}, 50%, 50%, 0.5);
`;

export default Layer;
