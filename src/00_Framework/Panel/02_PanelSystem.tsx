import { ReactNode, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Size2 } from "../../01_Utils/00_Point";
import WrapperSizeContext from "./01_WrapperSizeContext";

export interface PanelSystemProps {
  //string: テキトーな型
  className?: string;
  children: ReactNode[]; //Layerに限るってしたいんだが、やりかたわからない。
}

export const PanelSystem = styled(
  ({ className, children }: PanelSystemProps) => {
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

    return (
      <div className={className} ref={wrapperRef}>
        {wrapperSize && (
          <WrapperSizeContext.Provider value={wrapperSize}>
            {children}
          </WrapperSizeContext.Provider>
        )}
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
