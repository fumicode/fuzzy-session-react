import classNames from "classnames";
import ViewModel from "../Components/00_ViewModel";

import { FC, useState } from "react";
import styled from "styled-components";
import Money from "./Money";
import Wallet from "./WalletEntity";

const MoneyApp: FC = styled(({ className }: { className: string }) => {
  const a = new Wallet(1, new Money(10000));
  const b = new Wallet(2, new Money(2000));
  const c = new Wallet(3, new Money(300));

  const wallets = [a, b, c];

  const calcSum = (wallets: Iterable<Wallet>) =>
    [...wallets].reduce(
      (memo: Money, other: Wallet) => memo.merge(other.money),
      new Money(0)
    );

  const sum = calcSum(wallets);

  return (
    <>
      <h1>Point Flow</h1>

      <table className={className}>
        <tbody>
          {wallets.map((thisWallet) => (
            <tr key={thisWallet.id}>
              <th>{thisWallet.id}</th>
              <td> {thisWallet.toString()} </td>
              <td>
                <WalletControllView main={thisWallet} otherWallets={wallets}/>
              </td>
            </tr>
          ))}
          <tr>
            <th>計</th>
            <td>{sum.toString()}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
})`
  border-collapse: collapse;

  > tbody {
    > tr {
      > td {
        border: 1px solid black;
        text-align: center;

        &.m-center {
          border: 3px solid;
        }
      }
    }
  }
`;

export default MoneyApp;

interface WalletControllViewModel extends ViewModel<Wallet> {
  otherWallets: Wallet[];
}

type WalletFuture = (wallet: Wallet) => Wallet;

const WalletControllView: FC<WalletControllViewModel> = styled(
  ({
    className,
    main: thisWallet,

    otherWallets,
  }: WalletControllViewModel) => {
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [distinationWallet, setDistinationWallet] = useState<Wallet | undefined>(undefined);




    return (
      <div className={className}>
        <form
          onSubmit={() =>
            alert(
              `${thisWallet}が${distinationWallet}に${amount}円送金しようとしています！`
            )
          }
        >
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(parseInt(e.target.value));
            }}
          />
          円
          <select onChange={(e)=>{
            const wallet = otherWallets.find((wallet)=>wallet.id === parseInt(e.target.value));
            if(wallet){
              setDistinationWallet(wallet);
            }
          }}>
            <option value={undefined} />
            {otherWallets.map((distinationWallet) => (
              <option value={distinationWallet.id} key={distinationWallet.id}>
                {distinationWallet.id}
              </option>
            ))}
          </select>
          さんに
          <button type="submit">送る</button>
        </form>
      </div>
    );
  }
)`
  display: flex;
`;
