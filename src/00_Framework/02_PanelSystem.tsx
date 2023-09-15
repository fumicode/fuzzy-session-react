import { FC, useEffect } from "react";
import styled from "styled-components";
import ViewModel from "./00_ViewModel";
import Panel from "./Panel/02_Panel";
import Layer from "./Panel/02_Layer";
import React from "react";
import SmartRect from "./Panel/01_SmartRect";

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

    if (rect) {
    }
    const handleChangeWindow = () => {
      const doc = docRef.current;
      if (!doc) {
        throw new Error("panel not found");
      }

      setRect(doc.getBoundingClientRect());
      console.log(rect);
    };
    useEffect(handleChangeWindow, [
      rect?.x,
      rect?.y,
      rect?.width,
      rect?.height,
    ]);

    const [spacingDirection, setSpacingDirection] = React.useState<
      string | undefined
    >(undefined);

    useEffect(() => {
      window.addEventListener("resize", handleChangeWindow);
    }, []);

    return (
      <div className={className} ref={docRef}>
        <Layer>layer 1</Layer>
        <Layer>layer 2</Layer>
        <Layer>
          layer 3
          <div className="e-window">
            {rect && (
              <Panel
                title="hoge"
                x={80}
                y={130}
                width={500}
                height={500}
                parentWidth={rect?.width}
                parentHeight={rect?.height}
                onPanelChange={(smartRect: SmartRect) => {
                  console.log(smartRect.toJSON());

                  const directions = ["上", "右", "下", "左"];
                  const maxSpace = Math.max(...smartRect.spaces);
                  const maxIndex = smartRect.spaces.findIndex(
                    (item) => item === maxSpace
                  );
                  setSpacingDirection(directions[maxIndex]);
                }}
              >
                <p>あ一番あいてるのは、 {spacingDirection}</p>
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
