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

export const PanelSystem: FC<PanelSystemViewModel> = styled(
  ({ className }: PanelSystemViewModel) => {
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
    const [childPosition, setChildPosition] = useState<Point2>({
      x: 300,
      y: 300,
    });

    const divRef = useRef<HTMLDivElement>(null);

    const [parentSize, setParentSize] = useState<Size2 | null>(null);

    const resizeWindow = () => {
      if (!divRef.current) {
        return;
      }
      setParentSize(divRef.current.getBoundingClientRect());
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
        {parentSize && (
          <>
            <Layer zIndex={zIndexCalcurator.getZIndex("layer1empty")}>
              layer 1
            </Layer>
            <Layer zIndex={zIndexCalcurator.getZIndex("layer2child")}>
              layer 2
              <div className="e-window">
                <Panel
                  title="Child"
                  position={childPosition}
                  size={{ width: 200, height: 200 }}
                  parentSize={parentSize}
                  zIndex={0}
                  onPanelChange={(smartRect: SmartRect) => {}}
                  onRelationOpen={(thisRect: SmartRect) => {
                    const direction = thisRect.calcSpaceWideDirection();
                    setParentPosition(thisRect.calcPositionToOpen(direction));
                    setLayerOrder([
                      "layer1empty",
                      "layer2child",
                      "layer3parent", //親を一番上にする
                    ]);
                  }}
                ></Panel>
              </div>
            </Layer>
            <Layer zIndex={zIndexCalcurator.getZIndex("layer3parent")}>
              layer 3
              <div className="e-window">
                <Panel
                  title="Parent"
                  position={parentPosition}
                  size={{ width: 200, height: 200 }}
                  parentSize={parentSize}
                  zIndex={0}
                  onPanelChange={(smartRect: SmartRect) => {}}
                  onRelationOpen={(thisRect: SmartRect) => {
                    const direction = thisRect.calcSpaceWideDirection();
                    setChildPosition(thisRect.calcPositionToOpen(direction));

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

          <button
            onClick={() => {
              setCounter(counter + 1);
            }}
          >
            count up
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

  > .e-controlls {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }
`;

export default PanelSystem;
