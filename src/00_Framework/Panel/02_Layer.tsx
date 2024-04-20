import { FC, useEffect } from "react";
import styled from "styled-components";
import React from "react";

export interface LayerProps {
  //string: テキトーな型
  className?: string;
  zIndex?: number;
  zIndexMax?: number;
  name: string;
  colorHue: number;
  opacity?: number;
  zScaler?: ZScalerFunction;
  children?: React.ReactNode;

  onLayerHeaderClick?(name: string): void;
}

export type ZScalerFunction = (zIndex: number, maxZIndex: number) => number;

export const inversePropotionFunctionGenerator =
  (curveRate: number = 8) =>
  (x: number, max: number) => {
    return func(max-x, curveRate)
  }

const func = (x:number, a:number) => { //反比例関数で、xが0のときに1を返す関数。
  return a / (x + a);
}

export const weakInversePropotion: ZScalerFunction =
  inversePropotionFunctionGenerator(8);

export const constantFunction: ZScalerFunction = (x: number) => 1;

/*
export const reverseInversePropotion: ZIndex2ScaleFunction = (
  z: number,
  max: number
) => {
  //まだうまく動いてない
  const x = max - z;
  return Math.pow(-x, 3);
};*/

export const reversePropotion: ZScalerFunction = (z: number, max: number) => {
  return (z / max) * 0.2 + 0.8;
};

export const Layer: FC<LayerProps> = styled(
  ({
    className,
    name,
    zIndex,
    zIndexMax = 10,
    zScaler: zScaler = reversePropotion, //reverseInversePropotion,
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

          transform: `scale(${zScaler(zIndex || 0, zIndexMax)})`,
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

  transition: transform 0.3s ease-in-out;
  transform-origin: center center;

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
