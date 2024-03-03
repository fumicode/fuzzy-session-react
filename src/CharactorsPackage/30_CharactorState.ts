import update from "immutability-helper";
import CharactorEntity, {
  CharactorId,
  CharactorRelation,
} from "./20_CharactorEntity";
import ZIndexCalcurator from "../01_Utils/01_ZIndexCalcurator";
import { Id, convertIdentifiablesToMap } from "../00_Framework/00_Entity";
import { Action } from "../00_Framework/00_Action";
import { useReducer } from "react";
import { Point2, Size2 } from "../01_Utils/00_Point";

export class PanelBoxViewModel {
  constructor(
    readonly id: Id,
    readonly position: Point2,
    readonly size: Size2
  ) {}

  moveTo(newPosition: Point2): this {
    return new PanelBoxViewModel(this.id, newPosition, this.size) as this;
  }
}

//CharactorEntity
const itachi = new CharactorEntity(new CharactorId("0"), "イタチ", 0, []);
const sasuke = new CharactorEntity(new CharactorId("1"), "サスケ", 0, []);
const naruto = new CharactorEntity(new CharactorId("2"), "ナルト", 0, []);

//CharactorRelationをつなげる
itachi.relatedCharactors.push(new CharactorRelation(sasuke, "弟"));
itachi.relatedCharactors.push(new CharactorRelation(naruto, "弟をよろしく"));

sasuke.relatedCharactors.push(new CharactorRelation(itachi, "兄"));
sasuke.relatedCharactors.push(new CharactorRelation(naruto, "友達"));

naruto.relatedCharactors.push(new CharactorRelation(sasuke, "友達"));

const itachiBVM = new PanelBoxViewModel(
  itachi.id,
  { x: 100, y: 100 },
  { width: 250, height: 200 }
);

const sasukeBVM = new PanelBoxViewModel(
  sasuke.id,
  { x: 100, y: 300 },
  { width: 250, height: 200 }
);

const narutoBVM = new PanelBoxViewModel(
  naruto.id,
  { x: 100, y: 500 },
  { width: 250, height: 200 }
);

interface GlobalStore {
  domain: {
    charactors: Map<string, CharactorEntity>;
  };
  view: {
    charactorPBVMs: Map<string, PanelBoxViewModel>;
    charaZ: ZIndexCalcurator;
  };
}

type ActionType =
  | {
      type: "/domain/charactors/:charaId";
      charaId: Id;
      action: Action<CharactorEntity>;
    }
  | {
      type: "/view/charactorPBVMs/:charaId";
      charaId: Id;
      action: Action<PanelBoxViewModel>;
    }
  | {
      type: "/view/charaZ";
      action: Action<ZIndexCalcurator>;
    };

const reducer = (state: GlobalStore, action: ActionType) => {
  switch (action.type) {
    case "/domain/charactors/:charaId":
      //const a = this.findById(charaId);
      const chara = state.domain.charactors.get(action.charaId.toString());

      if (!chara) {
        //見つからなかったら何もしない
        return state;
      }

      return update(state, {
        domain: {
          charactors: {
            $add: [[action.charaId.toString(), action.action(chara)]],
          },
        },
      });

    case "/view/charactorPBVMs/:charaId":
      //const a = this.findById(charaId);
      const charaPBVM = state.view.charactorPBVMs.get(
        action.charaId.toString()
      );

      if (!charaPBVM) {
        //見つからなかったら何もしない
        return state;
      }

      return update(state, {
        view: {
          charactorPBVMs: {
            $add: [[action.charaId.toString(), action.action(charaPBVM)]],
          },
        },
      });
    case "/view/charaZ":
      return update(state, {
        view: { charaZ: { $set: action.action(state.view.charaZ) } },
      });
    default:
      return state;
  }
};

export interface Repository<T> {
  findAll: () => IterableIterator<T>;
  getSize(): number;
  findById: (id: Id) => T | undefined;
  dispatchOne: (id: Id, action: Action<T>) => void;
}

export interface SingleRepository<T> {
  get: () => T;
  dispatch: (action: Action<T>) => void;
}

export type CharactorsRepos = {
  charactorsRepo: Repository<CharactorEntity>;
  charactorPBVMsRepo: Repository<PanelBoxViewModel>;
  charaZRepo: SingleRepository<ZIndexCalcurator>;
};

export const useCharactorsRepos = function (): CharactorsRepos {
  const [globalStore, dispatch] = useReducer(reducer, {
    domain: {
      //localStorage とか cookie とかに保存したい
      charactors: convertIdentifiablesToMap([itachi, sasuke, naruto]),
    },
    view: {
      charactorPBVMs: convertIdentifiablesToMap([
        itachiBVM,
        sasukeBVM,
        narutoBVM,
      ]),
      charaZ: new ZIndexCalcurator(
        [itachi, sasuke, naruto].map((chara) => chara.id.toString())
      ),
    },
  });

  const charactorsRepo: Repository<CharactorEntity> = {
    findAll: () => globalStore.domain.charactors.values(),
    getSize(): number {
      return globalStore.domain.charactors.size;
    },
    findById: (id: Id) => globalStore.domain.charactors.get(id.toString()),

    dispatchOne: (charaId: Id, action: Action<CharactorEntity>) => {
      dispatch({
        type: "/domain/charactors/:charaId",
        charaId,
        action,
      });
    },
  };

  const charactorPBVMsRepo: Repository<PanelBoxViewModel> = {
    findAll: () => globalStore.view.charactorPBVMs.values(),
    getSize(): number {
      return globalStore.view.charactorPBVMs.size;
    },
    findById: (id: Id) => globalStore.view.charactorPBVMs.get(id.toString()),

    dispatchOne: (charaId: Id, action: Action<PanelBoxViewModel>) => {
      dispatch({
        type: "/view/charactorPBVMs/:charaId",
        charaId,
        action,
      });
    },
  };

  const charaZRepo: SingleRepository<ZIndexCalcurator> = {
    get: () => globalStore.view.charaZ,
    dispatch: (action: Action<ZIndexCalcurator>) => {
      //あとでcharaZ特有に変換する
      dispatch({
        type: "/view/charaZ",
        action: action,
      });
    },
  };

  return {
    //domain
    charactorsRepo,

    //view
    charactorPBVMsRepo,
    charaZRepo,
  };
};
