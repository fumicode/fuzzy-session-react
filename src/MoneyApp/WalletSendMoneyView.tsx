import ViewModel from "../00_Framework/00_ViewModel";

import { FC, useState } from "react";
import styled from "styled-components";
import Wallet, { WalletId } from "./WalletEntity";
import {
  Action,
  calcErrorReason,
  peekIntoFuture,
} from "../00_Framework/00_Action";

export type WalletPairAction = Action<[Wallet|undefined, Wallet|undefined]>; //送金元、送金先

export interface WalletSendMoneyViewModel extends ViewModel<Wallet> {
  otherWallets: Wallet[];

  onWalletChange: (
    [senderWalletId, receiverWalletId]: [WalletId, WalletId],
    walletsAction: WalletPairAction
  ) => void;
}

export const createWalletPairSendMoneyAction = (
  amount: number | undefined
): WalletPairAction => {
  return ([thisWallet, distinationWallet]) => {
    if (!thisWallet) {
      throw new Error(`送信元のウォレットを指定してください。`);
    }
    if (!distinationWallet) {
      throw new Error(`送信先のウォレットを指定してください。`);
    }
    if (!(amount && amount >= 0)) {
      throw new Error(
        `送金額はいくらですか？正の整数が必要です。頂いた値：${amount}`
      );
    }

    return thisWallet.sendMoney(distinationWallet, amount);
  };
};

export const WalletSendMoneyView: FC<WalletSendMoneyViewModel> = styled(
  ({
    className,
    main: thisWallet,

    otherWallets,
    onWalletChange,
  }: WalletSendMoneyViewModel) => {
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [distinationWalletId, setDistinationWalletId] = useState<
      WalletId | undefined
    >(undefined);

    const distinationWallet = otherWallets.find(
      (w) => distinationWalletId && w.id.equals(distinationWalletId)
    );

    const errorReason = calcErrorReason(
      [thisWallet, distinationWallet],
      createWalletPairSendMoneyAction(amount)
    );
    return (
      <div className={className}>
        <form
          className="e-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!distinationWalletId) {
              throw new Error(`送金先が未入力です！`);
            }
            if (!(amount && amount >= 0)) {
              throw new Error(`送金額が未入力です！`);
            }

            onWalletChange(
              [thisWallet.id, distinationWalletId],
              createWalletPairSendMoneyAction(amount)
            );
          }}
        >
          <input
            type="number"
            value={amount || ""}
            onChange={(e) => {
              setAmount(parseInt(e.target.value));
            }}
          />
          円
          <select
            onChange={(e) => {
              const w = otherWallets.find((w) =>
                w.id.equals(new WalletId(e.target.value))
              );

              setDistinationWalletId(w?.id || undefined);
            }}
          >
            <option value={undefined} />
            {otherWallets.map((distinationWallet) => (
              <option
                value={distinationWallet.id.toString()}
                key={distinationWallet.id.toString()}
                disabled={distinationWallet.id.equals(thisWallet.id)}
              >
                {distinationWallet.id.toString()}
              </option>
            ))}
          </select>
          さんに
          <button
            className="e-submit-button"
            disabled={
              !peekIntoFuture(
                [thisWallet, distinationWallet],
                createWalletPairSendMoneyAction(amount)
              )
            }
            type="submit"
          >
            送る
            {errorReason && (
              <div className="e-disabled-reason-container">
                <div className="e-box">
                  ⚠️
                  {errorReason}
                </div>
              </div>
            )}
          </button>
        </form>
      </div>
    );
  }
)`
  display: flex;

  > .e-form {
    > .e-submit-button {
      position: relative;

      &[disabled]:hover {
        > .e-disabled-reason-container {
          display: block;
        }
      }

      > .e-disabled-reason-container {
        display: none;
        position: absolute;
        top: 0;
        left: auto;
        right: auto;

        > .e-box {
          text-align: left;
          position: absolute;
          bottom: 0;

          padding: 0.5ex;
          line-height: 1;
          white-space: nowrap;
          max-width: 20em;

          color: #fff;
          border-radius: 2px;

          background: rgba(0, 0, 0, 0.5);

          &:hover {
            white-space: normal;
            min-width: 20em;

            &::after {
              display: none;
            }
          }

          &::after {
            content: " ";

            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 3em;

            //右がだんだん白くなるグラデーション
            background: linear-gradient(
              to left,
              hsla(0, 100%, 100%, 1) 20%,
              hsla(0, 100%, 100%, 0) 100%
            );
          }
        }
      }
    }
  }
`;
