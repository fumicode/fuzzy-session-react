import { calcErrorReason, peekIntoFuture } from "./00_Action";

describe("peekIntoFuture", () => {
  it("特に何も起こらなければ、true", () => {
    const session = { foo: "bar" };
    const action = (current: typeof session) => current;
    const result = peekIntoFuture(session, action);
    expect(result).toBe(true);
  });

  it("例外が投げられた場合、false", () => {
    const session = { foo: "bar" };
    const action = (current: typeof session) => {
      throw new Error("error");
    };
    const result = peekIntoFuture(session, action);
    expect(result).toBe(false);
  });
});

describe("calcErrorReason", () => {
  it("特に何も起こらなければ、エラーの理由はないので、undefined", () => {
    const session = { foo: "bar" };
    const action = (current: typeof session) => current;
    const result = calcErrorReason(session, action);
    expect(result).toBeUndefined();
  });

  it("例外が投げられた場合、エラーの理由を返す", () => {
    const session = { foo: "bar" };
    const action = (current: typeof session) => {
      throw new Error("error");
    };
    const result = calcErrorReason(session, action);
    expect(result).toBe("error");
  });
});
