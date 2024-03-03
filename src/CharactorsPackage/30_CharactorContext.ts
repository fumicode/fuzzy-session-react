import { createContext } from "react";
import { CharactorsRepos } from "./30_CharactorState";

export const CharactorsContext = createContext<CharactorsRepos | null>(null);
