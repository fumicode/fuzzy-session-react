
import { FC, useEffect } from "react";
import styled from "styled-components";
import ViewModel from "./00_ViewModel";
import Panel from "./Panel/02_Panel";
import Layer from "./Panel/02_Layer";
import React from "react";


interface PanelSystemViewModel extends ViewModel<string>{ //string: テキトーな型
  name: string;
  width: number;
}

export const PanelSystem:FC<PanelSystemViewModel> = styled(({
  className,
  name
}:  PanelSystemViewModel ) =>{

  const docRef = React.useRef<HTMLDivElement>(null);
  const [rect, setRect] = React.useState<DOMRectReadOnly | undefined>(undefined);

  useEffect(() => {
    const doc = docRef.current; 
    if(!doc){
      throw new Error('panel not found');

    }
    setRect(doc.getBoundingClientRect());
    console.log(rect);

  });
  

  return (
    <div className={className} ref={docRef}> 
      <Layer>layer 1</Layer>
      <Layer>layer 2</Layer>
      <Layer>layer 3 

        <div className="e-window">
          <Panel title="hoge" x={80} y={130} width={500} height={500} parentWidth={rect?.width} parentHeight={rect?.height}>
            <p>{(name+` body. `).repeat(100)}</p>
          </Panel>
        </div>
      </Layer>

      <aside>{rect && JSON.stringify(rect, null, '  ')}</aside>
    </div>
  );

})`

width: 100%;
min-height: 100%;
background: white;
position: relative;

`;

export default PanelSystem;