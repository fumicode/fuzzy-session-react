import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ViewModel from "../00_ViewModel";
import Panel from "./02_Panel";
import Layer from "./02_Layer";
import SmartRect from "./01_SmartRect";
import { Point2, Size2 } from "../../01_Utils/00_Point";
import ZIndexCalcurator from "../../01_Utils/01_ZIndexCalcurator";
import CharactorEntity, {
  CharactorRelation,
  CharactorView,
} from "./20_CharactorEntity";
import update from "immutability-helper";

interface PanelSystemViewModel extends ViewModel<string> {
  //string: テキトーな型
}

class PanelBoxViewModel<T> {
  constructor(
    readonly id: string,
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

const itachi = new CharactorEntity("0", "イタチ", []);

const itachiBVM = new PanelBoxViewModel<CharactorEntity>(
  itachi.id,
  itachi,
  { x: 100, y: 100 },
  { width: 200, height: 300 }
);

const sasuke = new CharactorEntity("1", "サスケ", []);

const sasukeBVM = new PanelBoxViewModel<CharactorEntity>(
  sasuke.id,
  sasuke,
  { x: 300, y: 300 },
  { width: 180, height: 180 }
);

const naruto = new CharactorEntity("2", "ナルト", []);
const narutoBVM = new PanelBoxViewModel<CharactorEntity>(
  naruto.id,
  naruto,
  { x: 500, y: 500 },
  { width: 180, height: 180 }
);

itachi.relatedCharactors.push(new CharactorRelation(sasuke, "brother"));
sasuke.relatedCharactors.push(new CharactorRelation(itachi, "brother"));
itachi.relatedCharactors.push(new CharactorRelation(naruto, "trusting"));
naruto.relatedCharactors.push(new CharactorRelation(sasuke, "friend"));
sasuke.relatedCharactors.push(new CharactorRelation(naruto, "friend"));

interface GlobalStore {
  charactors: CharactorEntity[];
  charactorBVMs: Map<string, PanelBoxViewModel<CharactorEntity>>;
}

export const PanelSystem = styled(({ className }: PanelSystemViewModel) => {
  const [globalStore, setGlobalStore] = useState<GlobalStore>({
    charactors: [itachi, sasuke, naruto],
    charactorBVMs: new Map([
      ["0", itachiBVM],
      ["1", sasukeBVM],
      ["2", narutoBVM],
    ]),
  });
  const [layerOrder, setLayerOrder] = useState<string[]>(
    [...globalStore.charactorBVMs].map(([_, charactor]) => `${charactor.id}`)
  );

  const zIndexCalcurator = new ZIndexCalcurator(layerOrder);

  const divRef = useRef<HTMLDivElement>(null);

  const [wrapperSize, setWrapperSize] = useState<Size2 | null>(null);

  const resizeWindow = () => {
    if (!divRef.current) {
      return;
    }
    setWrapperSize(divRef.current.getBoundingClientRect());
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

  const handleRelationOpen = (thisRect: SmartRect, relatedId: string) => {
    //検索
    const relatedCharaBVM = globalStore.charactorBVMs.get(relatedId);

    if (!relatedCharaBVM) {
      throw new Error(`charactor is undefined. id: ${relatedId}`);
    }

    try {
      //変更
      const newPos = thisRect.calcPositionToOpen(relatedCharaBVM.size);
      const newChara = relatedCharaBVM.moveTo(newPos);

      //保存
      const newGlobalStore = update(globalStore, {
        charactorBVMs: {
          $add: [[relatedCharaBVM.id, newChara]],
        },
      });

      setGlobalStore(newGlobalStore);

      const index = layerOrder.indexOf(relatedCharaBVM.id);
      const spliced = layerOrder.slice();
      spliced.splice(index, 1);
      setLayerOrder([...spliced, relatedCharaBVM.id]);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert(e);
      }
    }
  };

  return (
    <div className={className} ref={divRef}>
      {wrapperSize &&
        [...globalStore.charactorBVMs.keys()].map((layerId, index) => {
          const charaId = layerId;
          if (!charaId) {
            return;
          }
          const charactorBVM = globalStore.charactorBVMs.get(charaId);
          if (charactorBVM === undefined) {
            throw new Error(`charactor is undefined. charaId: ${charaId}`);
          }

          const colorHue = (index * 120) / globalStore.charactorBVMs.size;
          return (
            <Layer
              zIndex={zIndexCalcurator.getZIndex(layerId)}
              colorHue={colorHue}
              key={layerId}
            >
              Layer {layerId}
              <div className="e-window">
                <Panel
                  position={charactorBVM.position}
                  size={charactorBVM.size}
                  parentSize={wrapperSize}
                  zIndex={0}
                  isActive={layerOrder[2] === charactorBVM.id}
                  onMove={(smartRect: SmartRect) => {}}
                >
                  {(renderedRect) => (
                    <CharactorView
                      main={charactorBVM.main}
                      colorHue={colorHue}
                      onRelationOpen={(rel) => {
                        if (!renderedRect) {
                          return;
                        }

                        handleRelationOpen(renderedRect, rel.targetId);
                      }}
                    ></CharactorView>
                  )}
                </Panel>
              </div>
            </Layer>
          );
        })}
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
