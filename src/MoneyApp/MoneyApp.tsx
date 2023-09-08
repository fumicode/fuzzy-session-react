
import classNames from "classnames";
import ViewModel from "../Components/00_ViewModel";

import { FC } from "react";
import styled from "styled-components";



class Money{
  constructor(
    readonly amount: number
  ){ }

  subtract(amount:number){
    return new Money(this.amount - amount);
  }

  toString(){
    return '¥'+this.amount.toString();
  }
}


class MoneyAppViewModel implements ViewModel<string>{
  constructor(
    readonly main: string,
    readonly className?: string,
  ){ }
}

const DB = {
  moneyAmount: new Money(1_0000),

}

const MoneyApp: FC<MoneyAppViewModel> = styled(({
  main: gaiaCode,
  className: c
}: MoneyAppViewModel) => {
  return (
  <table className={c}>
    <tbody>

      <tr>
        <td>
          {DB.moneyAmount.toString()}

        </td>
      </tr>

    </tbody>
  </table>
  );
})`
border-collapse: collapse;

> tbody{
  > tr{
    > td{
      border: 1px solid black;
      width: 20px;
      height: 20px;
      text-align: center;

      &.m-center{
        border: 3px solid;

      }
    }

  }
}

`;

export default MoneyApp;