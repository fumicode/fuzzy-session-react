import Entity, { StringId } from "../../00_Framework/00_Entity";
import { SessionId } from "../20_SessionEntity";
import { TimeRange } from "../FuzzyTimePackage";
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

  exportSpec(): CalendarSpec {
    return {
      title: this.title,
      timeline: this.timeline,
    };
  }

  setTimeline(timeline: Timeline): this {
    const newSpec: CalendarSpec = Object.assign(this.exportSpec(), {
      timeline,
    });

    return this.update(newSpec);
  }

  setSessionTimeRange(sessionId: SessionId, timeRange: TimeRange): this {
    return this.update({
      timeline: this.timeline.setSessionTimeRange(sessionId, timeRange),
    });
  }

  update(changingContent: Partial<CalendarSpec>): this {
    return new this.ThisClass(
      this.id,
      Object.assign(this.exportSpec(), changingContent),
      this
    ) as this;
  }

  get ThisClass(): typeof CalendarEntity {
    return CalendarEntity;
  }
}
