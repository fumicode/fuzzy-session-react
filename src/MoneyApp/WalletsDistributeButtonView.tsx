import { FC } from "react";
import ViewModel from "../00_Framework/00_ViewModel";
import WalletEntity, { WalletId } from "./WalletEntity";
import styled from "styled-components";
import { Action, peekIntoFuture } from "../00_Framework/00_Action";

type DistributerReceivers = {
  distributer: WalletEntity;
  receivers: Map<string, WalletEntity>;
};

export type DistributerReceiversAction = Action<DistributerReceivers>;

export interface WalletsDistributeButtonViewModel
  extends ViewModel<WalletEntity> {
  receiverWallets: Map<string, WalletEntity>;
  sharingInfo: Map<string, number>; //{customerName: string, percentage: number}[];

  onDistributeExecute: (
    [distributerWalletId, receiverWalletIds]: [WalletId, Set<WalletId>],
    distributerReceiversAction: DistributerReceiversAction
  ) => void;
}

const createDistributerReceiversAction = (
  sharingInfo: Map<string, number>
): DistributerReceiversAction => {
  const distributerReceiversAction: DistributerReceiversAction = ({
    distributer: distributerWallet,
    receivers: receiverWallets,
  }: DistributerReceivers): DistributerReceivers => {
    const totalPercentage = [...sharingInfo.values()].reduce(
      (a, b) => a + b,
      0
    );
    if (totalPercentage >= 100) {
      throw new Error("分配率の合計が100%を超えています。");
    }

    const totalMoney = distributerWallet.money.amount;
    let newOriginalWallet = distributerWallet;

    const newReceiverWallets = [...receiverWallets.values()].map((w) => {
      const percentage = sharingInfo.get(w.id.value);
      if (!percentage) {
        throw new Error(`#${w.id.value}の分配情報がありません`);
      }

      const newMoney = Math.floor((totalMoney * percentage) / 100);

      let newW: WalletEntity;
      [newOriginalWallet, newW] = newOriginalWallet.sendMoney(w, newMoney);

      return newW;
    });

    return {
      distributer: newOriginalWallet,
      receivers: new Map([
        ...newReceiverWallets.map(
          (w) => [w.id.toString(), w] as [string, WalletEntity]
        ),
      ]),
    };
  };

  return distributerReceiversAction;
};

const WalletsDistributeButtonView: FC<WalletsDistributeButtonViewModel> = styled(
  ({
    main: distributerWallet,
    receiverWallets,
    sharingInfo,

    onDistributeExecute,
  }: WalletsDistributeButtonViewModel) => {
    //TODO: あとで、 ActionCreatorで外に出す
    const distributerReceiversAction =
      createDistributerReceiversAction(sharingInfo);
    return (
      <button
        disabled={
          !peekIntoFuture<DistributerReceivers>(
            { distributer: distributerWallet, receivers: receiverWallets },
            distributerReceiversAction
          )
        }
        onClick={() => {
          onDistributeExecute(
            [
              distributerWallet.id,
              new Set(
                [...receiverWallets.keys()].map((str) => new WalletId(str))
              ),
            ],
            distributerReceiversAction
          );
        }}
      >
        分配率に応じて分配
      </button>
    );
  }
)``;

export default WalletsDistributeButtonView;
