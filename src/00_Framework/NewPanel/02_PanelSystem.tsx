import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ViewModel from "../00_ViewModel";
import Panel from "./02_Panel";
import Layer from "./02_Layer";
import SmartRect from "./01_SmartRect";
import { Point2, Size2 } from "../../01_Utils/00_Point";
import ZIndexCalcurator from "../../01_Utils/01_ZIndexCalcurator";

interface PanelSystemViewModel extends ViewModel<string> {
  //string: テキトーな型
}

type RelationType = "friend" | "brother" | "trusting";

class CharactorRelation {
  constructor(readonly target: Charactor, readonly relation: RelationType) {}
}
class Charactor {
  constructor(
    readonly name: string,
    public relatedCharactors: CharactorRelation[] //一時的にmutableにしておく
  ) {}
}

const itachi = new Charactor("イタチ", []);
const sasuke = new Charactor("サスケ", []);
const naruto = new Charactor("ナルト", []);

itachi.relatedCharactors.push(new CharactorRelation(sasuke, "brother"));
sasuke.relatedCharactors.push(new CharactorRelation(itachi, "brother"));
itachi.relatedCharactors.push(new CharactorRelation(naruto, "trusting"));
naruto.relatedCharactors.push(new CharactorRelation(sasuke, "friend"));
sasuke.relatedCharactors.push(new CharactorRelation(naruto, "friend"));

const charactorsData = [itachi, sasuke, naruto];

export const PanelSystem: FC<PanelSystemViewModel> = styled(
  ({ className }: PanelSystemViewModel) => {
    const [charactors, setCharactors] = useState<Charactor[]>(charactorsData);
    const [layerOrder, setLayerOrder] = useState<string[]>([
      "layer1empty",
      "layer2child",
      "layer3parent",
    ]);

    const zIndexCalcurator = new ZIndexCalcurator(layerOrder);

    const [parentPosition, setParentPosition] = useState<Point2>({
      x: 100,
      y: 100,
    });
    const [parentSize, setParentSize] = useState<Size2>({
      width: 200,
      height: 500,
    });

    const [childPosition, setChildPosition] = useState<Point2>({
      x: 300,
      y: 300,
    });
    const [childSize, setChildSize] = useState<Size2>({
      width: 180,
      height: 180,
    });

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
        {wrapperSize && (
          <>
            <Layer
              zIndex={zIndexCalcurator.getZIndex("layer1empty")}
              colorHue={0}
            >
              layer 1
            </Layer>
            <Layer
              zIndex={zIndexCalcurator.getZIndex("layer2child")}
              colorHue={60}
            >
              layer 2
              <div className="e-window">
                <Panel
                  title="弟:サスケ@音♪"
                  position={childPosition}
                  size={childSize}
                  parentSize={wrapperSize}
                  zIndex={0}
                  colorHue={60}
                  isActive={layerOrder[2] === "layer2child"}
                  onMove={(smartRect: SmartRect) => {}}
                  onRelationOpen={(thisRect: SmartRect) => {
                    setParentPosition(thisRect.calcPositionToOpen(parentSize));
                    setLayerOrder([
                      "layer1empty",
                      "layer2child",
                      "layer3parent", //親を一番上にする
                    ]);
                  }}
                ></Panel>
              </div>
            </Layer>
            <Layer
              zIndex={zIndexCalcurator.getZIndex("layer3parent")}
              colorHue={120}
            >
              layer 3
              <div className="e-window">
                <Panel
                  title="兄:イタチ@暁☆"
                  position={parentPosition}
                  size={parentSize}
                  parentSize={wrapperSize}
                  zIndex={0}
                  colorHue={120}
                  isActive={layerOrder[2] === "layer3parent"}
                  onMove={(smartRect: SmartRect) => {}}
                  onRelationOpen={(thisRect: SmartRect) => {
                    setChildPosition(thisRect.calcPositionToOpen(childSize));

                    setLayerOrder([
                      "layer1empty",
                      "layer3parent",
                      "layer2child", //子を一番上にする
                    ]);
                  }}
                ></Panel>
              </div>
            </Layer>
          </>
        )}
        <div className="e-controlls">
          <button
            onClick={() => {
              setParentPosition({
                x: parentPosition.x + 10,
                y: parentPosition.y,
              });
            }}
          >
            →
          </button>
          <button
            onClick={() => {
              setParentPosition({
                x: parentPosition.x,
                y: parentPosition.y + 10,
              });
            }}
          >
            ↓
          </button>
        </div>
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
