import { RefObject, useEffect, useRef, useState } from "react";
import { Point2, Size2 } from "../../01_Utils/00_Point";
import SmartRect from "./01_SmartRect";

//TODO: 抽象化？早すぎたかしら？？ もうすこし出てからでいいかも
const useGetSmartRect = (
  position: Point2,
  parentSize: Size2
): { renderedRect: SmartRect | undefined; ref: RefObject<HTMLDivElement> } => {
  const [renderedRect, setRenderedRect] = useState<SmartRect | undefined>(
    undefined
  );

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("useEffect");
    console.log(ref.current);
    const panelEl = ref.current;
    if (panelEl === null) {
      return;
    }

    console.log(panelEl.getBoundingClientRect());
    const rect = panelEl.getBoundingClientRect();
    const smartRect = new SmartRect(rect, parentSize);
    setRenderedRect(smartRect);
  }, [position]);

  return {
    renderedRect,
    ref,
  };
};

export default useGetSmartRect;
