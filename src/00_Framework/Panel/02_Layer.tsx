import { FC, useEffect } from "react";
import styled from "styled-components";
import React from "react";

interface LayerProps {
  //string: テキトーな型
  className?: string;
  zIndex?: number;
  zIndexMax?: number;
  name: string;
  colorHue: number;
  opacity?: number;
  zIndex2Scale?: ZIndex2ScaleFunction;
  children?: React.ReactNode;

  onLayerHeaderClick?(name: string): void;
}

type ZIndex2ScaleFunction = (zIndex: number, maxZIndex: number) => number;

export const inversePropotionFunction =
  (xOffset: number = 8) =>
  (x: number, max: number) =>
    -1 / (x + xOffset) + 1;

export const weakInversePropotion: ZIndex2ScaleFunction =
  inversePropotionFunction(8);
export const constantFunction: ZIndex2ScaleFunction = (x: number) => 1;

/*
export const reverseInversePropotion: ZIndex2ScaleFunction = (
  z: number,
  max: number
) => {
  //まだうまく動いてない
  const x = max - z;
  return Math.pow(-x, 3);
};*/

export const reversePropotion: ZIndex2ScaleFunction = (
  z: number,
  max: number
) => {
  return (z / max) * 0.2 + 0.8;
};

export const Layer: FC<LayerProps> = styled(
  ({
    className,
    name,
    zIndex,
    zIndexMax = 10,
    zIndex2Scale = reversePropotion, //reverseInversePropotion,
    children,
    onLayerHeaderClick,
  }: LayerProps) => {
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
      <section
        className={className}
        ref={layerRef}
        style={{
          zIndex,

          transform: `scale(${zIndex2Scale(zIndex || 0, zIndexMax)})`,
        }}
      >
        <header
          className="e-layer-name"
          onClick={(e) => {
            onLayerHeaderClick && onLayerHeaderClick(name);
          }}
        >
          <h1 className="e-name">
            <span className="e-text">{name}</span>
          </h1>
        </header>
        {children}
      </section>
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

  transition: transform 1s ease-in-out;
  transform-origin: 30% 40%;

  background: hsla(
    ${({ colorHue }) => colorHue},
    50%,
    50%,
    ${({ opacity }) => (opacity != undefined ? opacity : 0.1)}
  );

  .e-layer-name {
    pointer-events: auto;
    background: hsla(0, 0%, 100%, 0.5);
    cursor: pointer;

    > .e-name {
      margin: 0;
      padding: 0;
      font-size: 0.8rem;
      font-weight: normal;
      > .e-text {
        background: white;
      }
    }
  }
`;

export default Layer;
