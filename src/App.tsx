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
import SharingApp from "./MoneyAppPackage/SharingApp";
import MoneyApp from "./MoneyAppPackage/MoneyApp";
import CharactorsApp from "./CharactorsPackage/30_CharactorsApp";
import { useCharactorsRepos } from "./CharactorsPackage/30_CharactorState";
import { CharactorsContext } from "./CharactorsPackage/30_CharactorContext";

const App: FC = styled((props: { className: string }) => {
  const AppNames = ["PointFlow", "PointSharing", "FuzzySession", "Charactors"];
  const { className } = props;

  const [appZ, setAppZ] = useState(new ZIndexCalcurator(AppNames));

  const AppName = "FuzzySession";

  //const zIndexScaler = inversePropotionFunction(2);
  const appZScaler: ZScalerFunction = reversePropotion;

  const charaRepos = useCharactorsRepos();

  return (
    <CharactorsContext.Provider value={charaRepos}>
      <PanelSystem className={className}>
        <h1 className="e-os-title">DouOS</h1>
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
            overflow="visible"
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
            overflow="visible"
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

        <ul className="e-layer-list">
          {appZ.ids.map((id) => {
            return (
              <li
                key={id}
                onClick={() => {
                  setAppZ(appZ.moveToTop(id));
                }}
              >
                {id}
              </li>
            );
          })}
        </ul>
      </PanelSystem>
    </CharactorsContext.Provider>
  );
})`
  .e-os-title {
    position: absolute;

    right: 0;
    bottom: 0;
    color: skyblue;
  }
  .e-calendar-columns {
    display: flex;
    flex-direction: row;

    > .e-column {
    }
  }

  .e-layer-list {
    position: absolute;
    left: 0;
    bottom: 0;

    display: flex;
    flex-direction: column-reverse;

    margin: 0;
    padding: 0;

    z-index: 100; //最前面に表示されるようにする。TODO: 適当なので後で直す。

    list-style: none;

    > li {
      padding: 5px;
      background: white;

      &:hover {
        background: skyblue;
        cursor: pointer;
      }
    }
  }
`;

export default App;
