import { createContext } from "react";
import { CharactorsRepo } from "./30_CharactorState";

export const CharactorsContext = createContext<CharactorsRepo | null>(null);
