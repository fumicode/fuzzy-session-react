import React from "react";
import { render, screen } from "@testing-library/react";
import Money from "./Money";

test('お金を分けることができる', () => {
  //given
  const original = new Money(10000);

  //when
  const [nextOriginal, splitted] =  original.split(4000);

  //then
  expect(original.amount).toBe(10000);
  expect(nextOriginal.amount).toBe(6000);
  expect(splitted.amount).toBe(4000);
});


test('お金を合わせることができる', () => {
  //given
  const a = new Money(10000);
  const b = new Money(2000);

  //when
  const merged = a.merge(b);

  expect(a.amount).toBe(10000);
  expect(b.amount).toBe(2000);
  expect(merged.amount).toBe(12000);
});

