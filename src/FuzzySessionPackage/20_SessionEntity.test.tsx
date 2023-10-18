import SessionEntity, { SessionId } from "./20_SessionEntity";
import { TimeRange, FuzzyTime, TimeDiff } from "./FuzzyTimePackage/index";

describe("SessionEntity", () => {
  const id = new SessionId("test-id");
  const title = "test-title";
  const timeRange10_12 = new TimeRange(
    new FuzzyTime("10:00"),
    new FuzzyTime("12:00")
  );
  const prev8_9 = new SessionEntity(new SessionId("prev-id"), {
    title: "prev-title",
    timeRange: new TimeRange(new FuzzyTime("08:00"), new FuzzyTime("09:00")),
  });

  describe("constructor", () => {
    it("インスタンスを作成できる", () => {
      //given & when
      const session = new SessionEntity(
        id,
        { title, timeRange: timeRange10_12 },
        prev8_9
      );

      //then
      expect(session).toBeInstanceOf(SessionEntity);
      expect(session.id).toEqual(id);
      expect(session.title).toEqual(title);
      expect(session.timeRange).toEqual(timeRange10_12);
      expect(session.prev).toEqual(prev8_9);
    });
  });

  describe("overlaps", () => {
    it("時間が被ってたら被ってる時間のTimeRangeが返る", () => {
      //given
      const session10_12 = new SessionEntity(new SessionId("other-id"), {
        title: "other-title",
        timeRange: new TimeRange(
          new FuzzyTime("10:00"),
          new FuzzyTime("12:00")
        ),
      });
      const session11_13 = new SessionEntity(new SessionId("other-id"), {
        title: "other-title",
        timeRange: new TimeRange(
          new FuzzyTime("11:00"),
          new FuzzyTime("13:00")
        ),
      });

      //when
      const overlappingTimeRange = session10_12.overlaps(session11_13);

      //then
      expect(overlappingTimeRange).toEqual(
        new TimeRange(new FuzzyTime("11:00"), new FuzzyTime("12:00"))
      );
    });

    it("時間がかぶってなければundefinedになる。", () => {
      //given
      const timeRange13_14 = new TimeRange(
        new FuzzyTime("13:00"),
        new FuzzyTime("14:00")
      );
      const otherSession = new SessionEntity(new SessionId("other-id"), {
        title: "other-title",
        timeRange: timeRange13_14,
      });
      const session = new SessionEntity(id, {
        title,
        timeRange: timeRange10_12,
      });

      //when
      const overlappingTimeRange = session.overlaps(otherSession);
      //then
      expect(overlappingTimeRange).toBeUndefined();
    });
  });

  describe("changeStartTime", () => {
    it("与えられた差分で開始時間を変更できる。このとき終了時間は変わらない。", () => {
      //given
      const session = new SessionEntity(id, {
        title,
        timeRange: timeRange10_12,
      });
      const diff = new TimeDiff("+", 1, 30);

      //when
      const newSession = session.changeStartTime(diff);

      //then
      expect(newSession.timeRange.start).toEqual(new FuzzyTime("11:30"));
      expect(newSession.timeRange.end).toEqual(session.timeRange.end);
    });
  });

  describe("changeEndTime", () => {
    it("与えられた差分で修了時間を変更できる。このとき開始時間は変わらない。", () => {
      //given
      const session = new SessionEntity(id, {
        title,
        timeRange: timeRange10_12,
      });
      const diff = new TimeDiff("+", 1, 30);
      //when
      const newSession = session.changeEndTime(diff);

      //then
      expect(newSession.timeRange.end).toEqual(new FuzzyTime("13:30"));
      expect(newSession.timeRange.start).toEqual(session.timeRange.start);
    });
  });

  describe("changeTimeRange", () => {
    it("与えられた差分で開始・修了時間を両方一気に変更できる。", () => {
      //given
      const session = new SessionEntity(id, {
        title,
        timeRange: timeRange10_12,
      });
      const diff = new TimeDiff("+", 1, 30);

      //when
      const newSession = session.changeTimeRange(diff);

      //then
      expect(newSession.timeRange).toEqual(
        new TimeRange(new FuzzyTime("11:30"), new FuzzyTime("13:30"))
      );
    });
  });
});
