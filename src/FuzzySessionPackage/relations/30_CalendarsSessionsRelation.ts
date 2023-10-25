import { Action } from "../../00_Framework/00_Action";
import { Id } from "../../00_Framework/00_Entity";
import SessionEntity, { SessionAction, SessionId } from "../20_SessionEntity";
import CalendarEntity, {
  CalendarId,
} from "../CalendarPackage/20_CalendarEntity";
import { TimeRange } from "../FuzzyTimePackage";

interface UntypedRelation {
  fromId: Id;
  toId: Id;

  fromIs(id: Id): boolean;
  send(fromId: Id, event: unknown): unknown;
}

interface Relation<FT extends Id, TT extends Id> extends UntypedRelation {
  fromId: FT;
  toId: TT;

  send(fromId: FT, event: unknown): unknown;
}

type CalendarEvent = {
  type: "UPDATE_SESSION_TIME";

  timeRange: TimeRange;
};

type CalendarAction = Action<CalendarEntity>;

type SessionEvent = {
  type: "UPDATE_SESSION_TIME";

  timeRange: TimeRange;
};

interface CalendarsSessionsRelationSpec {
  // readonly isOwner: boolean,
  // readonly isEditor: boolean,
  // readonly isViewer: boolean
}
export default class CalendarsSessionsRelation
  implements Relation<CalendarId, SessionId>
{
  constructor(
    readonly calendarId: CalendarId,
    readonly sessionId: SessionId,

    readonly spec: CalendarsSessionsRelationSpec
  ) {}

  get fromId(): CalendarId {
    return this.calendarId;
  }

  get toId(): SessionId {
    return this.sessionId;
  }

  fromIs(id: Id): boolean {
    return id instanceof CalendarId && this.calendarId.equals(id);
  }

  send(fromId: CalendarId, event: CalendarEvent): SessionAction {
    if (!this.fromId.equals(fromId)) {
      throw new Error("fromIdが一致していません。");
    }
    switch (event.type) {
      case "UPDATE_SESSION_TIME":
        return (session: SessionEntity) =>
          session.setTimeRange(event.timeRange);
    }
  }
}

export class RelationRepository {
  constructor(readonly relations: UntypedRelation[]) {}

  findAllByFromId(id: Id): UntypedRelation[] | undefined {
    const found = this.relations.filter((r) => r.fromIs(id));
    if (found.length === 0) return undefined;

    return found;
  }

  send(fromId: Id, event: unknown): unknown {
    const found = this.findAllByFromId(fromId);

    if (found === undefined) throw new Error("関係性が見つかりませんでした。");

    const firstRel = found[0];

    return firstRel.send(fromId, event);
  }
}
