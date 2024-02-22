import { FC, useReducer, useState } from "react";
import styled from "styled-components";
import ViewModel from "../00_Framework/00_ViewModel";
import Panel from "../00_Framework/Panel/02_Panel";
import Layer, { constantFunction } from "../00_Framework/Panel/02_Layer";
import SmartRect from "../00_Framework/Panel/01_SmartRect";
import { Point2, Size2 } from "../01_Utils/00_Point";
import ZIndexCalcurator from "../01_Utils/01_ZIndexCalcurator";
import CharactorEntity, {
  CharactorId,
  CharactorRelation,
  CharactorView,
} from "./20_CharactorEntity";
import update from "immutability-helper";
import { Action } from "../00_Framework/00_Action";
import { Id, convertIdentifiablesToMap } from "../00_Framework/00_Entity";

export class PanelBoxViewModel<T> {
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
  domain: {
    charactors: Map<string, CharactorEntity>;
  };
  view: {
    charactorPBVMs: Map<string, PanelBoxViewModel<CharactorEntity>>;
    charaZ: ZIndexCalcurator;
  };
}

type ActionType =
  | {
      type: "/view/charactorPBVMs";
      charactorPBVMs: Map<string, PanelBoxViewModel<CharactorEntity>>;
    }
  | {
      type: "/view/charaZ";
      action: Action<ZIndexCalcurator>;
    };

const reducer = (state: GlobalStore, action: ActionType) => {
  if (action.type === "/view/charactorPBVMs") {
    return update(state, {
      view: { charactorPBVMs: { $set: action.charactorPBVMs } },
    });
  } else if (action.type === "/view/charaZ") {
    return update(state, {
      view: { charaZ: { $set: action.action(state.view.charaZ) } },
    });
  }
  return state;
};

const useGlobalStore = function () {
  const [globalStore, dispatch] = useReducer(reducer, {
    domain: {
      //localStorage とか cookie とかに保存したい
      charactors: convertIdentifiablesToMap([itachi, sasuke, naruto]),
    },
    view: {
      charactorPBVMs: convertIdentifiablesToMap([
        itachiBVM,
        sasukeBVM,
        narutoBVM,
      ]),
      charaZ: new ZIndexCalcurator(
        [itachi, sasuke, naruto].map((chara) => chara.id.toString())
      ),
    },
  });

  return {
    charactorPBVMsRepo: {
      findAll: () => globalStore.view.charactorPBVMs.values(),
      getSize(): number {
        return globalStore.view.charactorPBVMs.size;
      },
      findById: (id: Id) => globalStore.view.charactorPBVMs.get(id.toString()),

      save: (charactorPBVM: PanelBoxViewModel<CharactorEntity>) => {
        const newCharaView = update(globalStore.view.charactorPBVMs, {
          $add: [[charactorPBVM.id.toString(), charactorPBVM]],
        });

        dispatch({
          type: "/view/charactorPBVMs",
          charactorPBVMs: newCharaView,
        });
      },
    },

    charaZRepo: {
      get: () => globalStore.view.charaZ,
      dispatch: (action: Action<ZIndexCalcurator>) => {
        //あとでcharaZ特有に変換する
        dispatch({
          type: "/view/charaZ",
          action: action,
        });
      },
    },
  };
};

interface CharactorsAppViewModel extends ViewModel<{}> {
  //className,
  //main,

  onAppClick(): void;
}

export const CharactorsApp: FC<CharactorsAppViewModel> = styled(
  ({ onAppClick }: CharactorsAppViewModel) => {
    //Appの処理
    const { charactorPBVMsRepo: charactorPBVMsRepo, charaZRepo } =
      useGlobalStore();
    const charaZ = charaZRepo.get();

    const handleCharactorBVMChange = (
      relatedId: CharactorId,
      action: Action<PanelBoxViewModel<CharactorEntity>>
    ) => {
      //検索
      const relatedCharaBVM = charactorPBVMsRepo.findById(relatedId);

      if (!relatedCharaBVM) {
        throw new Error(`charactor is undefined. id: ${relatedId}`);
      }
      try {
        //変更
        const newChara = action(relatedCharaBVM);
        //保存
        charactorPBVMsRepo.save(newChara);
        charaZRepo.dispatch((charaZ) => charaZ.moveToTop(relatedId.toString()));
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert(e);
        }
      }
    };

    return (
      <>
        {[...charactorPBVMsRepo.findAll()].map((charaPBVM, index) => {
          const charaId = charaPBVM.id;
          if (!charaId) {
            return;
          }
          const charactorBVM = charactorPBVMsRepo.findById(charaId);
          if (!charactorBVM) {
            throw new Error(`charactor is undefined. charaId: ${charaId}`);
          }

          const colorHue = (index * 120) / charactorPBVMsRepo.getSize();
          return (
            <Layer
              zIndex={charaZ.get(charaId.toString())}
              colorHue={colorHue}
              opacity={0.2}
              name={`Charactor #${charaId} ${charaPBVM.main.name}`}
              zIndexMax={charactorPBVMsRepo.getSize() - 1}
              key={charaId.toString()}
              zScaler={constantFunction}
              onLayerHeaderClick={() => {
                onAppClick && onAppClick();
              }}
            >
              <Panel
                position={charactorBVM.position}
                size={charactorBVM.size}
                zIndex={charaZ.get(charaId.toString())}
                isActive={charaZ.isTop(charactorBVM.id.toString())}
                onMove={(smartRect: SmartRect) => {}}
                key={charactorBVM.id.toString()}
                onPanelClick={() => {
                  charaZRepo.dispatch((charaZ) =>
                    charaZ.moveToTop(charactorBVM.id.toString())
                  );
                  onAppClick && onAppClick();
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
      </>
    );
  }
)`
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

export default CharactorsApp;
