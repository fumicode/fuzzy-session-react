import { FC, useState } from "react";

import styled from "styled-components";
import PanelSystem from "./00_Framework/Panel/02_PanelSystem";
import Layer, {
  ZScalerFunction,
  reversePropotion,
} from "./00_Framework/Panel/02_Layer";
import ZIndexCalcurator from "./01_Utils/01_ZIndexCalcurator";
import FuzzySession from "./40_FuzzySession";
import Panel from "./00_Framework/Panel/02_Panel";
import SharingApp from "./MoneyApp/SharingApp";
import MoneyApp from "./MoneyApp/MoneyApp";
import CharactorsApp from "./00_Framework/Panel/30_CharactorsApp";

const App: FC = styled((props: { className: string }) => {
  const AppNames = ["PointFlow", "PointSharing", "FuzzySession", "Charactors"];

  const [appZ, setAppZ] = useState(new ZIndexCalcurator(AppNames));

  const AppName = "FuzzySession";

  //const zIndexScaler = inversePropotionFunction(2);
  const appZScaler: ZScalerFunction = reversePropotion;

  return (
    <PanelSystem main={undefined}>
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
    </PanelSystem>
  );
})`
  .e-calendar-columns {
    display: flex;
    flex-direction: row;

    > .e-column {
    }
  }
`;

export default App;
