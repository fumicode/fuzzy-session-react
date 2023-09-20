import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ViewModel from "../00_ViewModel";
import Panel from "./02_Panel";
import Layer from "./02_Layer";
import SmartRect from "./01_SmartRect";
import { Point2 } from "../../01_Utils/00_Point";

interface PanelSystemViewModel extends ViewModel<string> {
  //string: テキトーな型
}

export const PanelSystem: FC<PanelSystemViewModel> = styled(
  ({ className }: PanelSystemViewModel) => {
    const [position, setPosition] = useState<Point2>({ x: 100, y: 100 });
    const [counter, setCounter] = useState<number>(0);

    const divRef = useRef<HTMLDivElement>(null);

    const [parentSize, setParentSize] = useState<DOMRectReadOnly | null>(null);

    const resizeWindow = () => {
      if (!divRef.current) {
        return;
      }
      setParentSize(divRef.current.getBoundingClientRect());
    };

    useEffect(() => {
      window.addEventListener("resize", resizeWindow);
      resizeWindow();
      return () => {
        window.removeEventListener("resize", resizeWindow);
      };
    }, []);

    return (
      <div className={className} ref={divRef}>
        {parentSize && (
          <Layer zIndex={3}>
            layer 3
            <div className="e-window">
              <Panel
                title="Parent"
                position={position}
                size={{ width: 500, height: 500 }}
                parentSize={parentSize}
                zIndex={0}
                onPanelChange={(smartRect: SmartRect) => {}}
                onChildOpen={(smartRect: SmartRect) => {
                  //smartRect.positions[maxIndex]
                }}
                counter={counter}
              >
                <p>一番あいてるのは、 </p>
              </Panel>
            </div>
          </Layer>
        )}
        <div className="e-controlls">
          <button
            onClick={() => {
              setPosition({ x: position.x + 10, y: position.y });
            }}
          >
            →
          </button>
          <button
            onClick={() => {
              setPosition({ x: position.x, y: position.y + 10 });
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
