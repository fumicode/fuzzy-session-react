import SessionEntity, { SessionAction, SessionId } from "../20_SessionEntity";
import CalendarsSessionsRelation, {
  RelationRepository,
} from "./30_CalendarsSessionsRelation";
import CalendarEntity, {
  CalendarId,
} from "../CalendarPackage/20_CalendarEntity";
import Timeline from "../CalendarPackage/20_Timeline";
import { TimeRange } from "../FuzzyTimePackage";

describe("CalendarsSessionsRelation", () => {
  //given
  const calId = new CalendarId("院長のカレンダー");
  const sesId = new SessionId("施術");

  const sejutsuSession = new SessionEntity(sesId, {
    title: "施術",
    timeRange: new TimeRange("12:00", "13:00"),
    members: [],
  });

  const inchoCalendar = new CalendarEntity(calId, {
    title: "院長のカレンダー",
    timeline: new Timeline([sejutsuSession]),
  });

  const rel_incho_sejutsu = new CalendarsSessionsRelation(
    inchoCalendar.id,
    sejutsuSession.id,
    {}
  );

  it("インスタンス化できる", () => {
    //given & when

    //then
    expect(rel_incho_sejutsu).toBeInstanceOf(CalendarsSessionsRelation);
  });

  it("fromIdとtoIdを取得できる", () => {
    //given

    //when
    const fromId = rel_incho_sejutsu.fromId;
    const toId = rel_incho_sejutsu.toId;

    //then
    expect(fromId).toEqual(new CalendarId("院長のカレンダー"));
    expect(toId).toEqual(new SessionId("施術"));
  });

  describe("メッセージ送信", () => {
    it("セッション変更イベントをCalendarからSessionに送信できる", () => {
      //when
      const action = rel_incho_sejutsu.send(calId, {
        type: "UPDATE_SESSION_TIME",
        timeRange: new TimeRange("13:00", "14:00"),
      });

      const newSession = action(sejutsuSession);

      //then
      expect(newSession.timeRange).toEqual(new TimeRange("13:00", "14:00"));
    });
  });

  describe("RelationRepository", () => {
    const relRepo = new RelationRepository([rel_incho_sejutsu]);

    it("idにより関係性を見つけられる", () => {
      //when
      const rels = relRepo.findAllByFromId(new CalendarId("院長のカレンダー"));

      if (rels === undefined) throw new Error("rels is undefined");
      //then
      expect(rels[0]).toBeInstanceOf(CalendarsSessionsRelation);
    });

    it("見つけた関係性に、メッセージを送ることができる", () => {
      //given
      const rels = relRepo.findAllByFromId(calId);

      if (rels === undefined) throw new Error("rels is undefined");

      const firstRel = rels[0];

      //when
      if (firstRel instanceof CalendarsSessionsRelation) {
        const action = firstRel.send(calId, {
          type: "UPDATE_SESSION_TIME",
          timeRange: new TimeRange("13:00", "14:00"),
        });

        //普通使うときは、ここでdispatchActionなどすればいい。
        const newSession = action(sejutsuSession);

        expect(newSession.timeRange).toEqual(new TimeRange("13:00", "14:00"));
      }

      //then
    });
  });
});
