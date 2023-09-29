import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ViewModel from "../00_ViewModel";
import Panel from "./02_Panel";
import Layer, { ZScalerFunction, reversePropotion } from "./02_Layer";
import { Size2 } from "../../01_Utils/00_Point";
import ZIndexCalcurator from "../../01_Utils/01_ZIndexCalcurator";
import MoneyApp from "../../MoneyApp/MoneyApp";
import SharingApp from "../../MoneyApp/SharingApp";
import FuzzySession from "../../40_FuzzySession";
import CharactorsApp from "./30_CharactorsApp";
import WrapperSizeContext from "./01_WrapperSizeContext";

export interface PanelSystemViewModel extends ViewModel<string> {
  //string: テキトーな型
}

export const PanelSystem = styled(({ className }: PanelSystemViewModel) => {
  ////////////////////////////////
  //PanelSystemの処理

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [wrapperSize, setWrapperSize] = useState<Size2 | null>(null);

  const resizeWindow = () => {
    if (!wrapperRef.current) {
      return;
    }
    setWrapperSize(wrapperRef.current.getBoundingClientRect());
  };

  useEffect(() => {
    //一度だけ実行される。
    //初回と、Windowのサイズが変わったときに実行される。
    window.addEventListener("resize", resizeWindow);
    resizeWindow();
    return () => {
      window.removeEventListener("resize", resizeWindow);
    };
  }, []);

  const AppNames = ["PointFlow", "PointSharing", "FuzzySession", "Charactors"];

  const [appZ, setAppZ] = useState(new ZIndexCalcurator(AppNames));

  const AppName = "FuzzySession";

  //const zIndexScaler = inversePropotionFunction(2);
  const appZScaler: ZScalerFunction = reversePropotion;

  return (
    <div className={className} ref={wrapperRef}>
      {wrapperSize && (
        <WrapperSizeContext.Provider value={wrapperSize}>
          <Layer
            zIndex={appZ.get(AppName)}
            colorHue={0}
            name={AppName}
            zScaler={appZScaler}
            zIndexMax={appZ.max}
            onLayerHeaderClick={() => {
              setAppZ(appZ.moveToTop(AppName));
            }}
          >
            <FuzzySession
              main={{}}
              onPanelClick={() => {
                setAppZ(appZ.moveToTop(AppName));
              }}
            />
          </Layer>

          <Layer
            zIndex={appZ.get("PointSharing")}
            colorHue={0}
            name={"PointSharing"}
            zScaler={appZScaler}
            zIndexMax={appZ.max}
            onLayerHeaderClick={() => {
              setAppZ(appZ.moveToTop("PointSharing"));
            }}
          >
            <Panel
              position={{ x: 100, y: 500 }}
              size={{ width: 700, height: 500 }}
              zIndex={0}
              isActive={true}
              onMove={() => {}}
              bgColor="white"
              onPanelClick={() => {
                setAppZ(appZ.moveToTop("PointSharing"));
              }}
            >
              {(renderedRect) => <SharingApp />}
            </Panel>
          </Layer>

          <Layer
            zIndex={appZ.get("PointFlow")}
            colorHue={0}
            name="PointFlow"
            zScaler={appZScaler}
            zIndexMax={appZ.max}
            onLayerHeaderClick={() => {
              setAppZ(appZ.moveToTop("PointFlow"));
            }}
          >
            <Panel
              position={{ x: 300, y: 100 }}
              size={{ width: 500, height: 400 }}
              zIndex={0}
              isActive={true}
              bgColor="white"
              onMove={() => {}}
              onPanelClick={() => {
                setAppZ(appZ.moveToTop("PointFlow"));
              }}
            >
              {(renderedRect) => <MoneyApp />}
            </Panel>
          </Layer>

          <Layer
            zIndex={appZ.get("Charactors")}
            colorHue={60}
            name="Charactors"
            zScaler={appZScaler}
            zIndexMax={appZ.max}
            onLayerHeaderClick={() => {
              setAppZ(appZ.moveToTop("Charactors"));
            }}
          >
            <CharactorsApp
              main={{}}
              onAppClick={() => {
                setAppZ(appZ.moveToTop("Charactors"));
              }}
            />
          </Layer>
        </WrapperSizeContext.Provider>
      )}
    </div>
  );
})`
  width: 100%;
  min-height: 100%;
  background: white;
  position: relative;

  overflow: hidden;
  > .e-controlls {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }
`;

export default PanelSystem;
