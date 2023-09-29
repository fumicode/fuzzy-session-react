import { createContext } from "react";
import { Size2 } from "../../01_Utils/00_Point";

const WrapperSizeContext = createContext<Size2>({ width: 0, height: 0 });
export default WrapperSizeContext;
