import classNames from "classnames";
import ViewModel from "../Components/00_ViewModel";

import update from "immutability-helper";
import { FC, useState } from "react";
import styled from "styled-components";
import Money from "./Money";
import Wallet, { WalletId } from "./WalletEntity";
import { WalletControlView } from "./WalletControlView";


const MoneyApp: FC = styled(({ className }: { className: string }) => {

  const [wallets, setWallets]  = useState<Wallet[]>([
    new Wallet(100, new Money(10000)),
    new Wallet(200, new Money(2000)),
    new Wallet(300, new Money(300))
  ]);

  const calcSum = (wallets: Iterable<Wallet>) =>
    [...wallets].reduce(
      (memo: Money, other: Wallet) => memo.merge(other.money),
      new Money(0)
    );

  const sum = calcSum(wallets);

  const handleWalletPairChange = (
    senderWalletId: WalletId, 
    receiverWalletId: WalletId, 
    senderFuture: (sender: Wallet, receiver: Wallet) => [Wallet, Wallet],
  ) => {
    //検索
    const senderWallet = wallets.find((w)=>w.id === senderWalletId);
    const receiverWallet = wallets.find((w)=>w.id === receiverWalletId);

    if(senderWallet === undefined || receiverWallet === undefined){
      throw new Error(`指定されたウォレット${senderWalletId.toString()}->${receiverWalletId.toString()}が見つかりませんでした。`);
    }

    //更新
    const [newSenderWallet, newReceiverWallet] = senderFuture(senderWallet, receiverWallet);

    //永続化
    const sendedWallets = update(wallets, {
      $splice: [
        [wallets.findIndex((w)=>w.id === senderWalletId), 1, newSenderWallet],
        [wallets.findIndex((w)=>w.id === receiverWalletId), 1, newReceiverWallet]
      ],
    });
    setWallets(sendedWallets);
  }

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
                <WalletControlView 
                  main={thisWallet} 
                  otherWallets={wallets} 
                  onWalletChange={handleWalletPairChange}
                />
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