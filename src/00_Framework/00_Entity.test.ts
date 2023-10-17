import React from "react";
import { render, screen } from "@testing-library/react";
import { StringId } from "./00_Entity";

test("インスタンス化できる", () => {
  //given
  const id = new StringId();

  //when

  //then
  expect(id).toBeInstanceOf(StringId);
});

test("中身が同じならequalsはtrueを返す", () => {
  //given
  const id = new StringId("abc");
  const otherId = new StringId("abc");

  //when
  const equality = id.equals(otherId);

  //then

  expect(equality).toBe(true);
});
