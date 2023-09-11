import ViewModel from "../00_Framework/00_ViewModel";

import { FC, useState } from "react";
import styled from "styled-components";
import Wallet, { WalletId } from "./WalletEntity";
import { Future, errorReason, peekIntoFuture } from "../00_Framework/00_Future";

export interface WalletControllViewModel extends ViewModel<Wallet> {
  otherWallets: Wallet[];

  onWalletChange: (
    [senderWalletId, receiverWalletId]: [WalletId, WalletId],
    walletsFuture: ([sender, receiver]:[Wallet, Wallet]) => [Wallet, Wallet]
  ) => void;
}


type WalletPairFuture = Future<[Wallet, Wallet]>; //送金元、送金先


export const WalletControlView: FC<WalletControllViewModel> = styled(
  ({
    className,
    main: thisWallet,

    otherWallets,
    onWalletChange,
  }: WalletControllViewModel) => {
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [distinationWalletId, setDistinationWalletId] = useState<
      WalletId | undefined
    >(undefined);

    const distinationWallet = otherWallets.find((w) =>distinationWalletId && w.id.equals(distinationWalletId));

    const createWalletPairSendMoneyFuture: (amount:number | undefined) => WalletPairFuture = (amount: number | undefined)=>{
      return ([thisWallet, distinationWallet]) => {
        if(!(amount && amount >= 0)){
          throw new Error(`総金額はいくらですか？正の整数が必要です。頂いた値：${amount}`);
        }
        return thisWallet.sendMoney(distinationWallet, amount);
      };
    }

    const allInfoIsFilled =  distinationWallet && amount && amount >= 0;
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
              [ thisWallet.id, distinationWalletId],
              createWalletPairSendMoneyFuture(amount)
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
              >
                {distinationWallet.id.toString()}
              </option>
            ))}
          </select>
          さんに
          <button
            className="e-submit-button"
            disabled={!(
              allInfoIsFilled && 
              peekIntoFuture([thisWallet, distinationWallet], createWalletPairSendMoneyFuture(amount))
            )} 
          type="submit">
            送る
            <div className="e-disabled-reason-container">
              <div className="e-box">
                ⚠️
                {
                  allInfoIsFilled && errorReason([thisWallet, distinationWallet], createWalletPairSendMoneyFuture(amount))
                }
              </div>
            </div>
          </button>
        </form>
      </div>
    );
  }
)`
  display: flex;

  >.e-form{

    >.e-submit-button{
      position: relative;

      &[disabled]:hover{

        >.e-disabled-reason-container{
          display: block;
        }
      }
      
      >.e-disabled-reason-container{
        display: none;
        position: absolute;
          top: 0;
          left: auto;
          right: auto;


        >.e-box{
          position: absolute;
            bottom: 0;
          
          padding: 0.5ex;
          line-height: 1;
          white-space: nowrap;
          max-width: 20em;

          color: #fff;
          border-radius: 2px;

          background: rgba(0,0,0,0.5);
        }

      }

    }
  }
`;
