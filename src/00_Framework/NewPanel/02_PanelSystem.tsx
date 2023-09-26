import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ViewModel from "../00_ViewModel";
import Panel from "./02_Panel";
import Layer from "./02_Layer";
import SmartRect from "./01_SmartRect";
import { Point2, Size2 } from "../../01_Utils/00_Point";
import ZIndexCalcurator from "../../01_Utils/01_ZIndexCalcurator";
import Charactor, { CharactorRelation } from "./20_Charactor";
import update from "immutability-helper";

interface PanelSystemViewModel extends ViewModel<string> {
  //string: テキトーな型
}

const itachi = new Charactor(
  "0",
  "イタチ",
  [],
  { x: 100, y: 100 },
  { width: 200, height: 300 }
);
const sasuke = new Charactor(
  "1",
  "サスケ",
  [],
  { x: 300, y: 300 },
  { width: 180, height: 180 }
);
const naruto = new Charactor(
  "2",
  "ナルト",
  [],
  { x: 500, y: 500 },
  { width: 180, height: 180 }
);

itachi.relatedCharactors.push(new CharactorRelation(sasuke, "brother"));
sasuke.relatedCharactors.push(new CharactorRelation(itachi, "brother"));
itachi.relatedCharactors.push(new CharactorRelation(naruto, "trusting"));
naruto.relatedCharactors.push(new CharactorRelation(sasuke, "friend"));
sasuke.relatedCharactors.push(new CharactorRelation(naruto, "friend"));

export const PanelSystem: FC<PanelSystemViewModel> = styled(
  ({ className }: PanelSystemViewModel) => {
    const [charactors, setCharactors] = useState<Map<string, Charactor>>(
      new Map([
        ["0", itachi],
        ["1", sasuke],
        ["2", naruto],
      ])
    );
    const [layerOrder, setLayerOrder] = useState<string[]>(
      [...charactors].map(([_, charactor]) => `${charactor.id}`)
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

    return (
      <div className={className} ref={divRef}>
        {wrapperSize &&
          [...charactors.keys()].map((layerId, index) => {
            const charaId = layerId;
            if (!charaId) {
              return;
            }
            const charactor = charactors.get(charaId);
            if (charactor === undefined) {
              throw new Error(`charactor is undefined. charaId: ${charaId}`);
            }

            const colorHue = (index * 120) / charactors.size;
            return (
              <Layer
                zIndex={zIndexCalcurator.getZIndex(layerId)}
                colorHue={colorHue}
                key={layerId}
              >
                Layer {layerId}
                <div className="e-window">
                  <Panel
                    charactorId={charactor.id}
                    title={charactor.name}
                    charactorRelations={charactor.relatedCharactors}
                    position={charactor.position}
                    size={charactor.size}
                    parentSize={wrapperSize}
                    zIndex={0}
                    colorHue={colorHue}
                    isActive={layerOrder[2] === charactor.id}
                    onMove={(smartRect: SmartRect) => {}}
                    onRelationOpen={(
                      thisRect: SmartRect,
                      relatedId: string
                    ) => {
                      //検索
                      const relatedChara = charactors.get(relatedId);

                      if (relatedChara === undefined) {
                        throw new Error(
                          `charactor is undefined. id: ${relatedId}`
                        );
                      }

                      try {
                        //変更
                        const newPos = thisRect.calcPositionToOpen(
                          relatedChara.size
                        );
                        const newChara = relatedChara.moveTo(newPos);
                        const newCharas = update(charactors, {
                          $add: [[relatedChara.id, newChara]],
                        });

                        //保存
                        setCharactors(newCharas);
                        const index = layerOrder.indexOf(relatedChara.id);
                        const spliced = layerOrder.slice();
                        spliced.splice(index, 1);
                        setLayerOrder([...spliced, relatedChara.id]);
                      } catch (e) {
                        if (e instanceof Error) {
                          alert(e.message);
                        } else {
                          alert(e);
                        }
                      }
                    }}
                  ></Panel>
                </div>
              </Layer>
            );
          })}
      </div>
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

export default PanelSystem;
