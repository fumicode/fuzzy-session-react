import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ViewModel from "../00_ViewModel";
import Panel from "./02_Panel";
import Layer, {
  ZScalerFunction,
  constantFunction,
  inversePropotionFunction,
  reversePropotion,
  weakInversePropotion,
} from "./02_Layer";
import SmartRect from "./01_SmartRect";
import { Point2, Size2 } from "../../01_Utils/00_Point";
import ZIndexCalcurator from "../../01_Utils/01_ZIndexCalcurator";
import CharactorEntity, {
  CharactorId,
  CharactorRelation,
  CharactorView,
} from "../../Components/20_CharactorEntity";
import update from "immutability-helper";
import { set } from "core-js/core/dict";
import { Action } from "../00_Action";
import { Id } from "../00_Entity";
import MoneyApp from "../../MoneyApp/MoneyApp";
import SharingApp from "../../MoneyApp/SharingApp";
import FuzzySession from "../../40_FuzzySession";

interface PanelSystemViewModel extends ViewModel<string> {
  //string: テキトーな型
}

class PanelBoxViewModel<T> {
  constructor(
    readonly id: Id,
    readonly main: T,
    readonly position: Point2,
    readonly size: Size2
  ) {}

  moveTo(newPosition: Point2): this {
    return new PanelBoxViewModel<T>(
      this.id,
      this.main,
      newPosition,
      this.size
    ) as this;
  }
}

//const zIndexScaler = inversePropotionFunction(2);
const appZScaler: ZScalerFunction = inversePropotionFunction(2);

//CharactorEntity
const itachi = new CharactorEntity(new CharactorId("0"), "イタチ", []);
const sasuke = new CharactorEntity(new CharactorId("1"), "サスケ", []);
const naruto = new CharactorEntity(new CharactorId("2"), "ナルト", []);

//CharactorRelationをつなげる
itachi.relatedCharactors.push(new CharactorRelation(sasuke, "弟"));
itachi.relatedCharactors.push(new CharactorRelation(naruto, "弟をよろしく"));

sasuke.relatedCharactors.push(new CharactorRelation(itachi, "兄"));
sasuke.relatedCharactors.push(new CharactorRelation(naruto, "友達"));

naruto.relatedCharactors.push(new CharactorRelation(sasuke, "友達"));

const itachiBVM = new PanelBoxViewModel<CharactorEntity>(
  itachi.id,
  itachi,
  { x: 100, y: 100 },
  { width: 200, height: 200 }
);

const sasukeBVM = new PanelBoxViewModel<CharactorEntity>(
  sasuke.id,
  sasuke,
  { x: 100, y: 300 },
  { width: 200, height: 200 }
);

const narutoBVM = new PanelBoxViewModel<CharactorEntity>(
  naruto.id,
  naruto,
  { x: 100, y: 500 },
  { width: 200, height: 200 }
);

interface GlobalStore {
  charactors: Map<string, CharactorEntity>;
  charactorPBVMs: Map<string, PanelBoxViewModel<CharactorEntity>>;
}

const useGlobalStore = function () {
  const [globalStore, setGlobalStore] = useState<GlobalStore>({
    //localStorage とか cookie とかに保存したい
    charactors: new Map([
      [itachi.id.toString(), itachi],
      [sasuke.id.toString(), sasuke],
      [naruto.id.toString(), naruto],
    ]),
    charactorPBVMs: new Map([
      [itachiBVM.id.toString(), itachiBVM],
      [sasukeBVM.id.toString(), sasukeBVM],
      [narutoBVM.id.toString(), narutoBVM],
    ]),
  });

  return {
    charactorPBVMsRepository: {
      findAll: () => globalStore.charactorPBVMs.values(),
      getSize(): number {
        return globalStore.charactorPBVMs.size;
      },
      findById: (id: Id) => globalStore.charactorPBVMs.get(id.toString()),
      save: (charactorPBVM: PanelBoxViewModel<CharactorEntity>) => {
        const newGlobalStore = update(globalStore, {
          charactorPBVMs: {
            $add: [[charactorPBVM.id.toString(), charactorPBVM]],
          },
        });
        setGlobalStore(newGlobalStore);
      },
    },
  };
};

export const PanelSystem = styled(({ className }: PanelSystemViewModel) => {
  //Appの処理
  const { charactorPBVMsRepository } = useGlobalStore();

  const [charaZ, setCharaZ] = useState<ZIndexCalcurator>(
    new ZIndexCalcurator(
      [...charactorPBVMsRepository.findAll()].map((chara) =>
        chara.id.toString()
      )
    )
  );

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

  const handleCharactorBVMChange = (
    relatedId: CharactorId,
    action: Action<PanelBoxViewModel<CharactorEntity>>
  ) => {
    //検索
    const relatedCharaBVM = charactorPBVMsRepository.findById(relatedId);

    if (!relatedCharaBVM) {
      throw new Error(`charactor is undefined. id: ${relatedId}`);
    }

    try {
      //変更
      const newChara = action(relatedCharaBVM);

      //保存
      charactorPBVMsRepository.save(newChara);

      setCharaZ(charaZ.moveToTop(relatedId.toString()));
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert(e);
      }
    }
  };

  const AppNames = ["PointFlow", "PointSharing", "FuzzySession", "Charactors"];

  const [appZ, setAppZ] = useState(new ZIndexCalcurator(AppNames));

  const AppName = "FuzzySession";

  return (
    <div className={className} ref={wrapperRef}>
      <Layer
        zIndex={appZ.get(AppName)}
        colorHue={0}
        name={AppName}
        zScaler={appZScaler}
        zIndexMax={appZ.size}
        onLayerHeaderClick={() => {
          setAppZ(appZ.moveToTop(AppName));
        }}
      >
        {wrapperSize && (
          <FuzzySession
            main={{}}
            wrapperSize={wrapperSize}
            onPanelClick={() => {
              setAppZ(appZ.moveToTop(AppName));
            }}
          />
        )}
      </Layer>

      <Layer
        zIndex={appZ.get("PointSharing")}
        colorHue={0}
        name={"PointSharing"}
        zScaler={appZScaler}
        zIndexMax={appZ.size}
        onLayerHeaderClick={() => {
          setAppZ(appZ.moveToTop("PointSharing"));
        }}
      >
        {wrapperSize && (
          <Panel
            position={{ x: 100, y: 500 }}
            size={{ width: 700, height: 500 }}
            zIndex={0}
            isActive={true}
            parentSize={wrapperSize}
            onMove={() => {}}
            bgColor="white"
            onPanelClick={() => {
              setAppZ(appZ.moveToTop("PointSharing"));
            }}
          >
            {(renderedRect) => <SharingApp />}
          </Panel>
        )}
      </Layer>

      <Layer
        zIndex={appZ.get("PointFlow")}
        colorHue={0}
        name="PointFlow"
        zScaler={appZScaler}
        zIndexMax={appZ.size}
        onLayerHeaderClick={() => {
          setAppZ(appZ.moveToTop("PointFlow"));
        }}
      >
        {wrapperSize && (
          <Panel
            position={{ x: 300, y: 100 }}
            size={{ width: 500, height: 400 }}
            zIndex={0}
            isActive={true}
            bgColor="white"
            parentSize={wrapperSize}
            onMove={() => {}}
            onPanelClick={() => {
              setAppZ(appZ.moveToTop("PointFlow"));
            }}
          >
            {(renderedRect) => <MoneyApp />}
          </Panel>
        )}
      </Layer>

      <Layer
        zIndex={appZ.get("Charactors")}
        colorHue={60}
        name="Charactors"
        zScaler={appZScaler}
        zIndexMax={appZ.size}
        onLayerHeaderClick={() => {
          setAppZ(appZ.moveToTop("Charactors"));
        }}
      >
        {wrapperSize &&
          [...charactorPBVMsRepository.findAll()].map((charaPBVM, index) => {
            const charaId = charaPBVM.id;
            if (!charaId) {
              return;
            }
            const charactorBVM = charactorPBVMsRepository.findById(charaId);
            if (!charactorBVM) {
              throw new Error(`charactor is undefined. charaId: ${charaId}`);
            }

            const colorHue = (index * 120) / charactorPBVMsRepository.getSize();
            return (
              <Layer
                zIndex={charaZ.get(charaId.toString())}
                colorHue={colorHue}
                opacity={0.2}
                name={`Charactor #${charaId} ${charaPBVM.main.name}`}
                zIndexMax={charactorPBVMsRepository.getSize() - 1}
                key={charaId.toString()}
                zScaler={constantFunction}
                onLayerHeaderClick={() => {
                  setAppZ(appZ.moveToTop("Charactors"));
                }}
              >
                <Panel
                  position={charactorBVM.position}
                  size={charactorBVM.size}
                  parentSize={wrapperSize}
                  zIndex={charaZ.get(charaId.toString())}
                  isActive={charaZ.isTop(charactorBVM.id.toString())}
                  onMove={(smartRect: SmartRect) => {}}
                  key={charactorBVM.id.toString()}
                  onPanelClick={() => {
                    setCharaZ(charaZ.moveToTop(charactorBVM.id.toString()));
                    setAppZ(appZ.moveToTop("Charactors"));
                  }}
                >
                  {(renderedRect) => (
                    <CharactorView
                      main={charactorBVM.main}
                      colorHue={colorHue}
                      onRelationOpen={(rel) => {
                        if (!renderedRect) {
                          return;
                        }

                        const moveCharactorBVMAction = (
                          charaBVM: PanelBoxViewModel<CharactorEntity>
                        ): PanelBoxViewModel<CharactorEntity> => {
                          const newPos = renderedRect.calcPositionToOpen(
                            charaBVM.size
                          );
                          return charaBVM.moveTo(newPos);
                        };

                        handleCharactorBVMChange(
                          rel.targetId,
                          moveCharactorBVMAction
                        );
                      }}
                    ></CharactorView>
                  )}
                </Panel>
              </Layer>
            );
          })}
      </Layer>
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
