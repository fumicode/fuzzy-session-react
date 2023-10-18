import Entity, { StringId } from "../../00_Framework/00_Entity";
import Timeline from "./20_Timeline";

export class CalendarId extends StringId {}

export interface CalendarSpec {
  readonly title: string;
  readonly timeline: Timeline;
}

export default class CalendarEntity implements Entity {
  readonly id: CalendarId;
  readonly title: string;
  readonly timeline: Timeline;

  constructor(
    id: CalendarId | string,
    spec: CalendarSpec,
    readonly prev: CalendarEntity | undefined = undefined
  ) {
    if (typeof id === "string") {
      this.id = new CalendarId(id);
    } else if (id instanceof CalendarId) {
      this.id = id;
    } else {
      throw new Error("CalendarIdの型がおかしいです。");
    }

    this.title = spec.title;
    this.timeline = spec.timeline;
  }
}
