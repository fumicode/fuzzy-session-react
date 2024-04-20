import { createContext } from "react";
import SessionEntity, { SessionId } from "./20_SessionEntity";
import UserEntity, { UserId } from "./20_UserEntity";
import CalendarEntity, { CalendarId } from "./CalendarPackage/20_CalendarEntity";
import { Id } from "../00_Framework/00_Entity";

export default interface FuzzySessionGlobalState {
  readonly calendars: Map<string, CalendarEntity>;
  readonly users: Map<string, UserEntity>;
  readonly sessions: Map<string, SessionEntity>;

  readonly relations: {};
}


type FSAction = (state: FuzzySessionGlobalState) => FuzzySessionGlobalState;

export const fuzzySessionReducer = (state: FuzzySessionGlobalState, action: FSAction) => {
  return action(state);
}

//この紐づけはもっと外側（clean architecture でいうところのmain）でやるべきかもしれないが・・・
const dictionary = new Map<
  Function,
  { property: keyof FuzzySessionGlobalState }
>([
  [SessionId, { property: "sessions" }],
  [CalendarId, { property: "calendars" }],
  [UserId, { property: "users" }],
]);

//作ってみたけど、まだ使えてない。dispatchを一元化しようとしてるけど最後よくわからん。
// 返り値のMapの型がunknownにしかできてないの残念。
export const findRepoPropNameByIdType = (id: Id): string => {
  if (!dictionary.has(id.constructor)) {
    throw new Error(`指定されたid ${id} は未対応です。`);
  }

  const propertyName = dictionary.get(id.constructor)?.property;
  if (propertyName === undefined) {
    throw new Error(`指定されたid ${id} は未対応です。`);
  }

  return propertyName;
};

export const FuzzySessionGlobalContext = createContext<FuzzySessionGlobalState>({
  calendars: new Map(),
  users: new Map(),
  sessions: new Map(),
  relations: {},
});
