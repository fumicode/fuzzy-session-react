import { createContext } from "react";
import SmartRect from "./01_SmartRect";


const PanelSizeContext = createContext<SmartRect | undefined>(undefined)
export default PanelSizeContext;