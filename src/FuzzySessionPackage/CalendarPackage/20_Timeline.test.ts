import Conflict from "./20_Conflict";
import SessionEntity from "../20_SessionEntity";
import Timeline, { TimelineSession } from "./20_Timeline";
import UserEntity from "../20_UserEntity";
import { TimeRange } from "../FuzzyTimePackage";

describe("Timeline", () => {
  const incho = new UserEntity(
    "incho",
    {
      name: "院長",
    },
    undefined
  );

  let inchoSessions: SessionEntity[] = [
    new SessionEntity(undefined, {
      title: "予定0",
      timeRange: new TimeRange("09:00", "11:00"),
      members: [incho],
    }),

    new SessionEntity(undefined, {
      title: "予定1",
      timeRange: new TimeRange("10:00", "12:00"),
      members: [incho],
    }),

    new SessionEntity(undefined, {
      title: "予定2",
      timeRange: new TimeRange("11:00", "14:00"),
      members: [incho],
    }),

    new SessionEntity(undefined, {
      title: "予定3",
      timeRange: new TimeRange("15:00", "17:00"),
      members: [incho],
    }),

    new SessionEntity(undefined, {
      title: "予定4",
      timeRange: new TimeRange("17:00", "18:00"),
      members: [incho],
    }),

    new SessionEntity(undefined, {
      title: "予定4",
      timeRange: new TimeRange("18:00", "20:00"),
      members: [incho],
    }),
  ];

  it("インスタンス化できる", () => {
    const timeline = new Timeline(inchoSessions);

    expect(timeline).toBeInstanceOf(Timeline);
  });

  it("セッションは集約ルートであるためそのまま保存されない。TimelineSessionとなる", () => {
    const timeline = new Timeline(inchoSessions);

    const timelineSession = timeline.get(inchoSessions[0].id);
    expect(timelineSession).toBeInstanceOf(TimelineSession);
  });

  it("そのIDのSessionが含まれているかどうかを確認できる", () => {
    const timeline = new Timeline(inchoSessions);
    const hasSession = timeline.has(inchoSessions[0].id);

    expect(hasSession).toBe(true);
  });

  it("新しいセッションを追加し、取得できる。", () => {
    const timeline = new Timeline(inchoSessions);
    const newSession = new SessionEntity(undefined, {
      title: "新しい予定",
      timeRange: new TimeRange("13:00", "15:00"),
      members: [incho],
    });

    const newTimeline = timeline.set(newSession.id, newSession);

    expect(newTimeline.get(newSession.id)).toEqual(
      new TimelineSession(newSession)
    );
  });

  it("セッションの数を取得できる", () => {
    const timeline = new Timeline(inchoSessions);

    expect(timeline.size).toBe(inchoSessions.length);
  });

  it("すべてのセッションを取得できる", () => {
    const timeline = new Timeline(inchoSessions);

    expect(timeline.sessions).toHaveLength(inchoSessions.length);
  });

  it("時間でならんだセッションを取得できる", () => {
    const timeline = new Timeline(inchoSessions);
    const orderedSessions = timeline.orderedSessionsByTimeRange;

    expect(orderedSessions).toEqual([
      new TimelineSession(inchoSessions[0]),
      new TimelineSession(inchoSessions[1]),
      new TimelineSession(inchoSessions[2]),
      new TimelineSession(inchoSessions[3]),
      new TimelineSession(inchoSessions[4]),
      new TimelineSession(inchoSessions[5]),
    ]);
  });

  it("予定の衝突を取得できる。", () => {
    const timeline = new Timeline(inchoSessions);
    const conflicts = timeline.conflicts;

    expect(conflicts).toEqual([
      new Conflict(inchoSessions[0], inchoSessions[1]),
      new Conflict(inchoSessions[1], inchoSessions[2]),
    ]);
  });

  it("予定の時間を変更できる", () => {
    //given
    const timeline = new Timeline(inchoSessions);
    const firstId = inchoSessions[0].id;

    //when

    const newTimeline = timeline.setSessionTimeRange(
      firstId,
      new TimeRange("10:00", "12:00")
    );

    //then
    //前のやつは変更されてないけど
    expect(timeline.get(firstId)?.timeRange).toEqual(
      new TimeRange("09:00", "11:00")
    );
    //新しいやつは変更されてる
    expect(newTimeline.get(firstId)?.timeRange).toEqual(
      new TimeRange("10:00", "12:00")
    );
  });
});
