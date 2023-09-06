import React from "react";
import { render, screen } from "@testing-library/react";
import FuzzyTime from "./10_FuzzyTime";

test('文字列から生成できる', () => {

  //given
  const ft = new FuzzyTime("10:00");

  //when then
  expect(ft).toBeInstanceOf(FuzzyTime);
});


test('2個の引数から生成できる', () => {
  //given
  const ft = new FuzzyTime(3, 2);

  //when then
  expect(ft).toBeInstanceOf(FuzzyTime);
});


test('FuzzyTimeからFuzzyTimeがつくれる', () => {
  //given
  const ft = new FuzzyTime(3, 2)
  const cloned = new FuzzyTime(ft);


  //when then
  expect(cloned).toBeInstanceOf(FuzzyTime);
});

