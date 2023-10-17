import React from "react";
import { render, screen } from "@testing-library/react";
import { StringId } from "./00_Entity";
import { extend } from "immutability-helper";

class AnotherId extends StringId {}
class TheOtherId extends StringId {}

describe("constructor", () => {
  test("インスタンス化できる", () => {
    //given
    const id = new StringId();

    //when

    //then
    expect(id).toBeInstanceOf(StringId);
  });

  test("引数なしの場合ランダムなIDが生成され、2つは同じにならない", () => {
    //given
    const id1 = new StringId();
    const id2 = new StringId();

    //when
    const equality = id1.equals(id2);

    //then
    expect(equality).toBe(false);
  });
});

describe("equals()", () => {
  test("中身が同じならequalsはtrueを返す", () => {
    //given
    const id = new StringId("abc");
    const otherId = new StringId("abc");

    //when
    const equality = id.equals(otherId);

    //then

    expect(equality).toBe(true);
  });

  test("中身が違っていたらequalsはfalseを返す", () => {
    //given
    const id = new StringId("abc");
    const otherId = new StringId("abd");

    //when
    const equality = id.equals(otherId);

    //then

    expect(equality).toBe(false);
  });

  test("型が違っていたら中身が同じでもequalsはfalseを返す", () => {
    //given
    const id = new AnotherId("abc");
    const otherId = new TheOtherId("abc");

    //when
    const equality = id.equals(otherId);

    //then
    expect(equality).toBe(false);
  });

  test("型が違っていたら親クラスだったとしてもequalsはfalseを返す", () => {
    //given
    const id = new AnotherId("abc");
    const otherId = new StringId("abc");

    //when
    const equality = id.equals(otherId);
    const equalityInverse = otherId.equals(id);

    //then
    expect(equality).toBe(false);
    expect(equalityInverse).toBe(false);
  });
});
