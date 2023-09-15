import { FC, useEffect } from "react";
import styled from "styled-components";
import React from "react";


interface LayerProps { //string: テキトーな型
  className?: string;
  children?: React.ReactNode;
}

export const Layer:FC<LayerProps> = styled(({
  className,
  children,
}:  LayerProps ) =>{
  const layerRef = React.useRef<HTMLDivElement>(null);
  const [rect, setRect] = React.useState<DOMRectReadOnly | undefined>(undefined);

  useEffect(() => {
    const layer = layerRef.current; 
    if(!layer){
      throw new Error('panel not found');
    }
    setRect(layer.getBoundingClientRect());


  });
  

  return (
    <div className={className} ref={layerRef}>
      <p>{rect && JSON.stringify(rect, null, '  ')}</p>
      {children}
    </div>
  );

})`

position: absolute;
  top: 0;
  left: 0;
  right: 0;

min-height: 100%;

overflow: hidden;

.e-window{
  display: contents;
  background: #eee;


}

&:nth-child(1){
  top: 30px; left: 30px; 
  background: hsla(0, 50%, 50%, 0.5);
}
&:nth-child(2){
  top: 60px; left: 60px; 
  background: hsla(60, 50%, 50%, 0.5);
}
&:nth-child(3){
  top: 90px; left: 90px; 
  background: hsla(120, 50%, 50%, 0.5);
}





`;

export default Layer;