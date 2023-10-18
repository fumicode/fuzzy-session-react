import GaiaCode, { ThreeRows } from "./20_GaiaCode";

describe("Gaia Code", () => {
  it("インスタンス化できる", () => {
    const code: ThreeRows = [
      [5, 8, 9, 5, 5, 9, 8],
      [0, 3, 6, 0, 0, 6, 3],
      [5, 3, 1, 5, 5, 1, 3],
    ];

    const a = new GaiaCode(code);
    expect(a).toBeInstanceOf(GaiaCode);
  });
});
