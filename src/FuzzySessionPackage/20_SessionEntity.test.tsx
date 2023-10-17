import SessionEntity, { SessionId } from "./20_SessionEntity";
import TimeRange from "./10_TimeRange";
import FuzzyTime from "./10_FuzzyTime";
import TimeDiff from "./00_TimeDiff";

describe("SessionEntity", () => {
  const id = new SessionId("test-id");
  const title = "test-title";
  const timeRange = new TimeRange(
    new FuzzyTime("10:00"),
    new FuzzyTime("12:00")
  );
  const prev = new SessionEntity(
    new SessionId("prev-id"),
    "prev-title",
    new TimeRange(new FuzzyTime("08:00"), new FuzzyTime("09:00"))
  );

  describe("constructor", () => {
    it("インスタンスを作成できる", () => {
      const session = new SessionEntity(id, title, timeRange, prev);
      expect(session).toBeInstanceOf(SessionEntity);
      expect(session.id).toEqual(id);
      expect(session.title).toEqual(title);
      expect(session.timeRange).toEqual(timeRange);
      expect(session.prev).toEqual(prev);
    });
  });

  describe("overlaps", () => {
    it("時間が被ってたら被ってる時間のTimeRangeが返る", () => {
      const otherTimeRange = new TimeRange(
        new FuzzyTime("11:00"),
        new FuzzyTime("13:00")
      );
      const otherSession = new SessionEntity(
        new SessionId("other-id"),
        "other-title",
        otherTimeRange
      );
      const session = new SessionEntity(id, title, timeRange);
      const overlappingTimeRange = session.overlaps(otherSession);
      expect(overlappingTimeRange).toEqual(
        new TimeRange(new FuzzyTime("11:00"), new FuzzyTime("12:00"))
      );
    });

    it("should return undefined if the given session does not overlap with this session", () => {
      const otherTimeRange = new TimeRange(
        new FuzzyTime("13:00"),
        new FuzzyTime("14:00")
      );
      const otherSession = new SessionEntity(
        new SessionId("other-id"),
        "other-title",
        otherTimeRange
      );
      const session = new SessionEntity(id, title, timeRange);
      const overlappingTimeRange = session.overlaps(otherSession);
      expect(overlappingTimeRange).toBeUndefined();
    });
  });

  describe("changeStartTime", () => {
    it("与えられた差分で開始時間を変更できる。このとき終了時間は変わらない。", () => {
      const session = new SessionEntity(id, title, timeRange);
      const diff = new TimeDiff("+", 1, 30);
      const newSession = session.changeStartTime(diff);
      expect(newSession.timeRange.start).toEqual(new FuzzyTime("11:30"));
      expect(newSession.timeRange.end).toEqual(session.timeRange.end);
    });
  });

  describe("changeEndTime", () => {
    it("与えられた差分で修了時間を変更できる。このとき開始時間は変わらない。", () => {
      const session = new SessionEntity(id, title, timeRange);
      const diff = new TimeDiff("+", 1, 30);
      const newSession = session.changeEndTime(diff);
      expect(newSession.timeRange.end).toEqual(new FuzzyTime("13:30"));
      expect(newSession.timeRange.start).toEqual(session.timeRange.start);
    });
  });

  describe("changeTimeRange", () => {
    it("与えられた差分で開始・修了時間を両方一気に変更できる。", () => {
      const session = new SessionEntity(id, title, timeRange);
      const diff = new TimeDiff("+", 1, 30);
      const newSession = session.changeTimeRange(diff);
      expect(newSession.timeRange).toEqual(
        new TimeRange(new FuzzyTime("11:30"), new FuzzyTime("13:30"))
      );
    });
  });
});
