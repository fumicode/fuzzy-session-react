import { FC, useEffect } from "react";
import styled from "styled-components";
import ViewModel from "../00_ViewModel";
import Panel from "./02_Panel";
import Layer from "./02_Layer";
import React from "react";
import SmartRect from "./01_SmartRect";
import ZIndexCalcurator from "../../01_Utils/01_ZIndexCalcurator";

interface PanelSystemViewModel extends ViewModel<string> {
  //string: テキトーな型
}

export const PanelSystem: FC<PanelSystemViewModel> = styled(
  ({ className }: PanelSystemViewModel) => {
    return (
      <div className={className}>
        {/** 
         * 
        <Layer zIndex={1}>layer 1</Layer>
        <Layer zIndex={2}>layer 2</Layer>
        */}
        <Layer zIndex={3}>
          layer 3
          <div className="e-window">
            <Panel
              title="Parent"
              position={{ x: 100, y: 100 }}
              size={{ width: 500, height: 500 }}
              parentSize={{ width: 1000, height: 1000 }}
              zIndex={0}
              onPanelChange={(smartRect: SmartRect) => {}}
              onChildOpen={(smartRect: SmartRect) => {
                //smartRect.positions[maxIndex]
              }}
            >
              <p>一番あいてるのは、 </p>
            </Panel>
          </div>
        </Layer>
      </div>
    );
  }
)`
  width: 100%;
  min-height: 100%;
  background: white;
  position: relative;
`;

export default PanelSystem;
