import ViewModel from "../00_Framework/00_ViewModel";

import { FC } from "react";
import styled from "styled-components";
import { Action } from "../00_Framework/00_Action";
import Money from "./Money";

export type MoneyAction = Action<Money>; 

export interface MoneyAmountRateViewModel extends ViewModel<Money> {

  max: Money;
}

const MoneyAmountRateView: FC<MoneyAmountRateViewModel> = styled(
  ({
    className,
    main: thisMoney,
    max
  }: MoneyAmountRateViewModel) => {

    
    const percentage = thisMoney.amount / max.amount * 100;
    const cssVariableStyle = { "--percentage": `${percentage}%` } as React.CSSProperties;

    return (
      <div className={className}
        style={cssVariableStyle}
      >
        {thisMoney.toString()}
      </div>
    );
  }
)`
position: relative;
width: 10ex;
--percentage: 50%;
height: 1em;

text-align: right;

&::before {
  position: absolute;
    top:0;
    left:0;
    bottom:0;
    z-index: -1;
  content: " ";
  display: block;
  width: var(--percentage);
  background: hsla(200, 50%, 50%, 0.2);
  transition: width 0.5s ease-in-out;
}
`;

export default MoneyAmountRateView;