
import classNames from "classnames";
import ViewModel from "../00_ViewModel";

import { FC } from "react";
import styled from "styled-components";


import GaiaCodeView from "./20_GaiaCodeView.tsx";

export GaiaCodeView;

export type SevenNumbers = [number, number, number, number, number, number, number];
export type ThreeRows = [SevenNumbers, SevenNumbers, SevenNumbers];


//ガイアコードとは:
export default class GaiaCode{
  readonly code: ThreeRows;

  constructor(code: ThreeRows){
    this.code = code;
  }
}
