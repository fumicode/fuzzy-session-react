import classNames from "classnames";
import ViewModel from "../00_Framework/00_ViewModel";

import update from "immutability-helper";
import { FC, useState } from "react";
import styled from "styled-components";
import Money from "./Money";
import Wallet, { WalletId } from "./WalletEntity";
import { WalletControlView } from "./WalletControlView";

const MoneyApp: FC = styled(({ className }: { className: string }) => {
  const [wallets, setWallets] = useState<Wallet[]>([
    new Wallet(new WalletId("田中"), new Money(10000)),
    new Wallet(new WalletId("佐藤"), new Money(2000)),
    new Wallet(new WalletId("石井"), new Money(300)),
  ]);

  const calcSum = (wallets: Iterable<Wallet>) =>
    [...wallets].reduce(
      (memo: Money, other: Wallet) => memo.merge(other.money),
      new Money(0)
    );

  const sum = calcSum(wallets);

  const handleWalletPairChange = (
    [senderWalletId, receiverWalletId]: [WalletId, WalletId],
    senderFuture: ([sender, receiver]:[Wallet, Wallet]) => [Wallet, Wallet]
  ) => {
    //検索
    const senderWallet = wallets.find((w) => w.id.equals(senderWalletId));
    const receiverWallet = wallets.find((w) => w.id.equals(receiverWalletId));

    try {
      if (senderWallet === undefined || receiverWallet === undefined) {
        throw new Error(
          `指定されたウォレット${senderWalletId.toString()}->${receiverWalletId.toString()}が見つかりませんでした。`
        );
      }

      //更新
      const [newSenderWallet, newReceiverWallet] = senderFuture(
        [senderWallet, receiverWallet]
      );

      //永続化
      const sendedWallets = update(wallets, {
        $splice: [
          [
            wallets.findIndex((w) => w.id.equals(senderWalletId)),
            1,
            newSenderWallet,
          ],
          [
            wallets.findIndex((w) => w.id.equals(receiverWalletId)),
            1,
            newReceiverWallet,
          ],
        ],
      });
      setWallets(sendedWallets);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert(e);
      }
    }
  };

  return (
    <>
      <h1>Point Flow</h1>

      <table className={className}>
        <thead>
          <tr>
            <th>ユーザー</th>
            <th>所持金</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((thisWallet) => {

            const percentage = thisWallet.money.amount / sum.amount * 100;
            const cssVariableStyle = { "--percentage": `${percentage}%` } as React.CSSProperties;
            return (
              <tr key={thisWallet.id.toString()}>
                <th>{thisWallet.id.toString()}</th>
                <td
                  className="e-money-amount"
                >
                  <div className="e-money-amount-div"
                    style={cssVariableStyle}
                  >
                    {thisWallet.money.toString()}{" "}
                  </div>
                </td>
                <td>
                  <WalletControlView
                    main={thisWallet}
                    otherWallets={wallets}
                    onWalletChange={handleWalletPairChange}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th>計</th>
            <td className="e-sum-amount">{sum.toString()}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
})`
border-collapse: collapse;

> * {
  > tr {
    > td, th {
      border: 1px solid black;
      text-align: left;
    }
  }
}
> thead {

}
> tbody {
  .e-money-amount {
    padding: 0;
    margin: 0;
    .e-money-amount-div {
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
    }
  }
}

> tfoot {
  > tr {
    > td, th {
    }
    > .e-sum-amount{
      text-align: right;

    }
  }
}
`;

export default MoneyApp;
