import classNames from "classnames";
import ViewModel from "../00_Framework/00_ViewModel";

import update from "immutability-helper";
import { FC, useState } from "react";
import styled from "styled-components";
import Money from "./Money";
import WalletEntity, { WalletId } from "./WalletEntity";
import { WalletSendMoneyView, WalletPairAction } from "./WalletSendMoneyView";


const capitalAlphabets: string = "ABCDEFGHIJKLM";

const sharingInfo: { customerName:string, percentage: number }[] = Array.from(capitalAlphabets).map((c, index) => {
  return { 
    customerName: "お客様"+c, 
    percentage: index % 2 === 0 ? 5 : 3
  };
});

const SharingApp: FC = styled(({ className }: { className: string }) => {

  const [wallets, setWallets] = useState(new Map<string, WalletEntity>([
    ["弊社", new WalletEntity(new WalletId("弊社"), new Money(1000000))],
    ...sharingInfo.map((info) => 
      [info.customerName, new WalletEntity(new WalletId(info.customerName), new Money(0))] as [string, WalletEntity]
    )
  ]));

  const calcSum = (wallets: Iterable<WalletEntity>) =>
    [...wallets].reduce(
      (memo: Money, other: WalletEntity) => memo.merge(other.money),
      new Money(0)
    );

  const sum = calcSum(wallets.values());

  const handleWalletPairChange = (
    [senderWalletId, receiverWalletId]: [WalletId, WalletId],
    walletPairAction: WalletPairAction 
  ) => {
    //検索
    const senderWallet   = wallets.get(senderWalletId.value);
    const receiverWallet = wallets.get(receiverWalletId.value);

    try {
      if (senderWallet === undefined || receiverWallet === undefined) {
        throw new Error(
          `指定されたウォレット${senderWalletId.toString()}->${receiverWalletId.toString()}が見つかりませんでした。`
        );
      }

      //更新
      const [newSenderWallet, newReceiverWallet] = walletPairAction(
        [senderWallet, receiverWallet]
      );

      if(newSenderWallet === undefined || newReceiverWallet === undefined){
        throw new Error(
          `Actionの結果、新しいウォレットペアのどちらか( ${senderWalletId.toString()} -> ${receiverWalletId.toString()} )が空になりました。削除したいってこと？`
        );
      }
      //永続化
      const sendedWallets = update(wallets, {
        $add: [
          [newSenderWallet.id.value, newSenderWallet],
          [newReceiverWallet.id.value, newReceiverWallet],
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

  const originalWallet = wallets.get("弊社");
  if(originalWallet === undefined){
    throw new Error("弊社のウォレットが見つかりませんでした。");
  }

  const receiverWallets = new Map(wallets);
        receiverWallets.delete('弊社');

  return (
    <>
      <h1>Point Flow</h1>

      <table className={className}>
        <thead>
          <tr>
            <th>ユーザー</th>
            <th>分配率</th>
            <th>所持金</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {[originalWallet].map((originalWallet) => {
            const percentage = originalWallet.money.amount / sum.amount * 100;
            const cssVariableStyle = { "--percentage": `${percentage}%` } as React.CSSProperties;

            return (
              <tr key={originalWallet.id.toString()}>
                <th>{originalWallet.id.toString()}</th>
                <td></td>
                <td
                  className="e-money-amount"
                >
                  <div className="e-money-amount-div"
                    style={cssVariableStyle}
                  >
                    {originalWallet.money.toString()}{" "}
                  </div>
                </td>
                <td>
                  <WalletSendMoneyView
                    main={originalWallet}
                    otherWallets={wallets.values()}
                    onWalletChange={handleWalletPairChange}
                  />
                  <button onClick={(e)=>{
                    const totalPercentage = sharingInfo.reduce((memo, info)=> memo + info.percentage, 0);
                    if(totalPercentage >= 100){
                      throw new Error ("分配率の合計が100%を超えています。");
                    }

                    const totalMoney = originalWallet.money.amount;
                    let newOriginalWallet = originalWallet;


                    const newReceiverWallets = [...receiverWallets.values()].map((w)=>{
                      const info = sharingInfo.find((info)=> info.customerName === w.id.value);
                      if(!info){
                        throw new Error ("分配先の情報が見つかりませんでした。");
                      }

                      const newMoney = Math.floor(totalMoney * info.percentage / 100);

                      let newW: WalletEntity;
                      [newOriginalWallet, newW] = newOriginalWallet.sendMoney(w, newMoney);


                      return newW;
                    });

                    setWallets(new Map([
                      [newOriginalWallet.id.toString(), newOriginalWallet],
                      ...(newReceiverWallets.map((w)=> 
                      [w.id.toString(), w] as [string, WalletEntity]))
                    ]));
                  }}>
                    分配率に応じて分配
                  </button>
                </td>
              </tr>
            );
          })}
          {[...receiverWallets.values()].map((thisWallet) => {

            const percentage = thisWallet.money.amount / sum.amount * 100;
            const cssVariableStyle = { "--percentage": `${percentage}%` } as React.CSSProperties;

            const info = sharingInfo.find((info)=> info.customerName === thisWallet.id.value);
            return (
              <tr key={thisWallet.id.toString()}>
                <th>{thisWallet.id.toString()}</th>
                <td>{info?.percentage && (info.percentage + '%')}</td>
                <td
                  className="e-money-amount"
                >
                  <div className="e-money-amount-div"
                    style={cssVariableStyle}
                  >
                    {thisWallet.money.toString()}{" "}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th>計</th>
            <td></td>
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

export default SharingApp;
