import { FC, useEffect } from "react";
import styled from "styled-components";
import ViewModel from "./00_ViewModel";
import Panel from "./Panel/02_Panel";
import Layer from "./Panel/02_Layer";
import React from "react";
import SmartRect from "./Panel/01_SmartRect";
import ZIndexCalcurator from "../01_Utils/01_ZIndexCalcurator";

interface PanelSystemViewModel extends ViewModel<string> {
  //string: テキトーな型
  name: string;
  width: number;
}

export const PanelSystem: FC<PanelSystemViewModel> = styled(
  ({ className, name }: PanelSystemViewModel) => {
    const docRef = React.useRef<HTMLDivElement>(null);
    const [rect, setRect] = React.useState<DOMRectReadOnly | undefined>(
      undefined
    );

    console.log("render panel system");

    if (rect) {
    }
    const handleChangeWindow = () => {
      const doc = docRef.current;
      if (!doc) {
        throw new Error("panel not found");
      }
      console.log("おまちかね！handle change window だよ！");

      setLayerOrder(layerOrder);
      setChildPosition(childPosition);
      setParentPosition(parentPosition);

      setRect(doc.getBoundingClientRect());
    };
    useEffect(handleChangeWindow, [
      rect?.x,
      rect?.y,
      rect?.width,
      rect?.height,
    ]);

    useEffect(() => {
      window.addEventListener("resize", handleChangeWindow);
    }, []);

    const [childPosition, setChildPosition] = React.useState<{
      x: number;
      y: number;
    }>({ x: 0, y: 330 });

    const [parentPosition, setParentPosition] = React.useState<{
      x: number;
      y: number;
    }>({ x: 80, y: 130 });

    const [spacingDirection, setSpacingDirection] = React.useState<
      string | undefined
    >(undefined);

    const [layerOrder, setLayerOrder] = React.useState<string[]>([
      "layer1empty",
      "layer2child",
      "layer3parent",
    ]);

    const zIndexCalcurator = new ZIndexCalcurator(layerOrder);

    useEffect(() => {
      handleChangeWindow();
      console.log({ childPosition, parentPosition });
    }, [
      childPosition.x,
      childPosition.y,
      parentPosition.x,
      parentPosition.y,

      layerOrder.join(","),
    ]);
    return (
      <div className={className} ref={docRef}>
        <Layer zIndex={zIndexCalcurator.getZIndex("layer1empty")}>
          layer 1
        </Layer>
        <Layer zIndex={zIndexCalcurator.getZIndex("layer2child")}>
          layer 2
          <div className="e-window">
            {rect && (
              <Panel
                title="Child"
                position={childPosition}
                size={{ width: 500, height: 500 }}
                zIndex={zIndexCalcurator.getZIndex("layer2child")}
                parentSize={rect}
                onPanelChange={(smartRect: SmartRect) => {
                  /*
                  const directions = ["上", "右", "下", "左"];
                  const maxSpace = Math.max(...smartRect.spaces);
                  const maxIndex = smartRect.spaces.findIndex(
                    (item) => item === maxSpace
                  );
                  setSpacingDirection(directions[maxIndex]);
                  */
                  handleChangeWindow();
                }}
                onChildOpen={(smartRect: SmartRect) => {
                  const maxSpace = Math.max(...smartRect.spaces);
                  const maxIndex = smartRect.spaces.findIndex(
                    (item) => item === maxSpace
                  );

                  setLayerOrder(["layer1empty", "layer2child", "layer3parent"]);
                  if (maxIndex === 0) {
                    //右
                    setParentPosition({
                      x: smartRect.left,
                      y: smartRect.top - 500,
                    });
                  } else if (maxIndex === 1) {
                    //右
                    setParentPosition({
                      x: smartRect.right,
                      y: smartRect.top,
                    });
                  } else if (maxIndex === 2) {
                    //下
                    setParentPosition({
                      x: smartRect.left,
                      y: smartRect.bottom,
                    });
                  } else if (maxIndex === 3) {
                    //左
                    setParentPosition({
                      x: smartRect.left - 500,
                      y: smartRect.top,
                    });
                  }
                }}
              >
                child
              </Panel>
            )}
          </div>
        </Layer>
        <Layer zIndex={zIndexCalcurator.getZIndex("layer3parent")}>
          layer 3
          <div className="e-window">
            {rect && (
              <Panel
                title="Parent"
                position={parentPosition}
                size={{ width: 500, height: 500 }}
                parentSize={rect}
                zIndex={zIndexCalcurator.getZIndex("layer2parent")}
                onPanelChange={(smartRect: SmartRect) => {
                  /*
                  const directions = ["上", "右", "下", "左"];
                  const maxSpace = Math.max(...smartRect.spaces);
                  const maxIndex = smartRect.spaces.findIndex(
                    (item) => item === maxSpace
                  );
                  setSpacingDirection(directions[maxIndex]);
                  */
                  handleChangeWindow();
                }}
                onChildOpen={(smartRect: SmartRect) => {
                  //const directions = ["上", "右", "下", "左"];
                  //const positions = ["top", "right", "bottom", "left"];
                  const maxSpace = Math.max(...smartRect.spaces);
                  const maxIndex = smartRect.spaces.findIndex(
                    (item) => item === maxSpace
                  );

                  setLayerOrder(["layer1empty", "layer3parent", "layer2child"]);
                  if (maxIndex === 0) {
                    //右
                    setChildPosition({
                      x: smartRect.left,
                      y: smartRect.top - 500,
                    });
                  } else if (maxIndex === 1) {
                    //右
                    setChildPosition({
                      x: smartRect.right,
                      y: smartRect.top,
                    });
                  } else if (maxIndex === 2) {
                    //下
                    setChildPosition({
                      x: smartRect.left,
                      y: smartRect.bottom,
                    });
                  } else if (maxIndex === 3) {
                    //左
                    setChildPosition({
                      x: smartRect.left - 500,
                      y: smartRect.top,
                    });
                  }

                  //smartRect.positions[maxIndex]
                }}
              >
                <p>一番あいてるのは、 {spacingDirection}</p>
              </Panel>
            )}
          </div>
        </Layer>

        <aside>{rect && JSON.stringify(rect, null, "  ")}</aside>
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
