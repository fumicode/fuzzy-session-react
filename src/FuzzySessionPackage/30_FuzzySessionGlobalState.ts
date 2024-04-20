import { createContext } from "react";
import SessionEntity from "./20_SessionEntity";
import UserEntity from "./20_UserEntity";
import CalendarEntity from "./CalendarPackage/20_CalendarEntity";

export default interface FuzzySessionGlobalState {
  readonly calendars: Map<string, CalendarEntity>;
  readonly users: Map<string, UserEntity>;
  readonly sessions: Map<string, SessionEntity>;

  readonly relations: {};
}

export const FuzzySessionGlobalContext = createContext<FuzzySessionGlobalState>({
  calendars: new Map(),
  users: new Map(),
  sessions: new Map(),
  relations: {},
});