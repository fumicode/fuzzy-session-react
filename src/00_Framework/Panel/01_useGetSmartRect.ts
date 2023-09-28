import { RefObject, useEffect, useRef, useState } from "react";
import { Point2, Size2 } from "../../01_Utils/00_Point";
import SmartRect from "./01_SmartRect";

//TODO: 抽象化？早すぎたかしら？？ もうすこし出てからでいいかも
const useGetSmartRect = (
  position: Point2, //位置
  parentSize: Size2, //親のサイズ
  ref: RefObject<HTMLDivElement>, //要素のref
  transitionState: string, //変更を検知するために使う
  onMove: (smartRect: SmartRect) => void = () => {}
): SmartRect | undefined => {
  const [renderedRect, setRenderedRect] = useState<SmartRect | undefined>(
    undefined
  );

  useEffect(() => {
    const panelEl = ref.current;
    if (panelEl === null) {
      return;
    }

    const rect = panelEl.getBoundingClientRect();
    const smartRect = new SmartRect(rect, parentSize);
    setRenderedRect(smartRect);
    onMove(smartRect);
  }, [position.x, position.y, parentSize, transitionState]);

  return renderedRect;
};

export default useGetSmartRect;
