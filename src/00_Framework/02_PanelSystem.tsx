
import { FC } from "react";
import styled from "styled-components";
import ViewModel from "./00_ViewModel";
import Panel from "./Panel/02_Window";


interface PanelSystemViewModel extends ViewModel<string>{ //string: テキトーな型
  name: string;
  width: number;
}

export const PanelSystem:FC<PanelSystemViewModel> = styled(({
  className,
  name
}:  PanelSystemViewModel ) =>{
  return (
    <div className={className}> 
      <div className="e-layer">layer 1 
      </div>
      <div className="e-layer">layer 2 </div>
      <div className="e-layer">layer 3 

        <div className="e-window">
          <Panel title="hoge" x={80} y={130} width={500} height={500}>
            <p>{(name+` body. `).repeat(100)}</p>
          </Panel>
        </div>
      </div>

    </div>
  );

})`

width: 100%;
min-height: 100%;
background: white;
position: relative;

>.e-layer{
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
    background: hsla(0, 50%, 50%, 0.5);
  }
  &:nth-child(2){
    background: hsla(60, 50%, 50%, 0.5);
  }
  &:nth-child(3){
    background: hsla(120, 50%, 50%, 0.5);
  }



}

`;

export default PanelSystem;