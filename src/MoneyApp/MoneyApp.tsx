
import classNames from "classnames";
import ViewModel from "../Components/00_ViewModel";

import { FC } from "react";
import styled from "styled-components";
import Money from "./Money";
import Wallet from "./WalletEntity";





const MoneyApp: FC = styled(({
  className
}: {className:string}) => {
  const a = new Wallet(1, new Money(10000));
  const b = new Wallet(2, new Money(2000));
  const c = new Wallet(3, new Money(300));

  const wallets = [a, b, c];
  return (
    <>
      <h1>Point Flow</h1>

      <table className={className}>
        <tbody>
          {wallets.map(w=>
            <tr>
              <th>{w.id}</th> <td> {w.toString()} </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
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