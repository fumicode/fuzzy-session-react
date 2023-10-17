import ViewModel from "../00_Framework/00_ViewModel";

import { FC } from "react";
import styled from "styled-components";
import { Action } from "../00_Framework/00_Action";
import Money from "../MoneyAppPackage/Money";

export interface MoneyAmountRateViewModel extends ViewModel<Money> {}

export const MoneyAmountRateView: FC<MoneyAmountRateViewModel> = styled(
  ({ className, main: thisMoney }: MoneyAmountRateViewModel) => {
    return <></>;
  }
)``;
