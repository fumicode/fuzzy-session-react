import classNames from "classnames";
import ViewModel from "../00_Framework/00_ViewModel";

import update from "immutability-helper";
import { FC, useState } from "react";
import styled from "styled-components";
import Money from "./Money";
import WalletEntity, { WalletId } from "./WalletEntity";
import { WalletSendMoneyView, WalletPairAction } from "./WalletSendMoneyView";
import MoneyAmountRateView from "./MoneyAmountRateView";
import WalletsDistributeButtonView, { DistributerReceiversAction } from "./WalletsDistributeButtonView";


const capitalAlphabets: string = "ABCDEFGHIJKLM";

const sharingInfo: { customerName:string, percentage: number }[] = Array.from(capitalAlphabets).map((c, index) => {
  return { 
    customerName: "お客様"+c, 
    percentage: index % 2 === 0 ? 5 : 3
  };
});

const sharingInfoMap = new Map(sharingInfo.map((obj) => [obj.customerName, obj.percentage ]));

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

  const handleDistributeExecute = (
    [distributerWalletId, receiverWalletIds]: [WalletId, Set<WalletId>],
    distributerReceiversAction: DistributerReceiversAction
  ):void => {

    //検索
    const distributerWallet   = wallets.get(distributerWalletId.value);
    const receiverWallets = [...receiverWalletIds]
      .map((id)=> wallets.get(id.value))
      .filter<WalletEntity>((w):w is WalletEntity => w instanceof WalletEntity);


    try {
      if (distributerWallet === undefined || receiverWallets === undefined) {
        throw new Error(
          `指定されたウォレット${distributerWalletId.toString()}->${[...receiverWalletIds].map((id)=>id.toString())}が見つかりませんでした。`
        );
      }
      if (receiverWalletIds.size !== receiverWallets.length){
        throw new Error(
          `一部のidのreceiver walletがみつからなかったようです。`
        );
      }

      //更新
      const {distributer: newDistributerWallet, receivers: newReceiverWallets} = distributerReceiversAction(
        {
          distributer:distributerWallet, 
          receivers: new Map(receiverWallets.map((rw)=>[rw?.id.toString() || "", rw]))
        }
      );

      if(newDistributerWallet === undefined || newReceiverWallets === undefined){
        throw new Error(
          `Actionの結果、新しいウォレットペアのどちらか( ${distributerWalletId.toString()} -> ${receiverWalletIds.toString()} )が空になりました。削除したいってこと？`
        );
      }

      //永続化
      const sendedWallets = update(wallets, {
        $add: [
          [newDistributerWallet.id.value, newDistributerWallet],
          ...newReceiverWallets
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


  }

  const originalWallet = wallets.get("弊社");
  if(originalWallet === undefined){
    throw new Error("弊社のウォレットが見つかりませんでした。");
  }

  const receiverWallets = new Map([...wallets]);
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


            return (
              <tr key={originalWallet.id.toString()}>
                <th>{originalWallet.id.toString()}</th>
                <td></td>
                <td
                  className="e-money-amount"
                >
                  <MoneyAmountRateView main={originalWallet.money} max={sum}/>
                </td>
                <td>
                  <WalletSendMoneyView
                    main={originalWallet}
                    otherWallets={[...wallets.values()]}
                    onWalletChange={handleWalletPairChange}
                  />
                  <WalletsDistributeButtonView  
                    main={originalWallet} 
                    receiverWallets={receiverWallets} 
                    sharingInfo={sharingInfoMap} 
                    onDistributeExecute={
                      handleDistributeExecute
                    }
                  />
                </td>
              </tr>
            );
          })}
          {[...receiverWallets.values()].map((thisWallet) => {


            const info = sharingInfo.find((info)=> info.customerName === thisWallet.id.value);
            return (
              <tr key={thisWallet.id.toString()}>
                <th>{thisWallet.id.toString()}</th>
                <td>{info?.percentage && (info.percentage + '%')}</td>
                <td
                  className="e-money-amount"
                >
                  <MoneyAmountRateView main={thisWallet.money} max={sum}/>
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
