import ViewModel from "../Components/00_ViewModel";

import { FC, useState } from "react";
import styled from "styled-components";
import Wallet, { WalletId } from "./WalletEntity";

export interface WalletControllViewModel extends ViewModel<Wallet> {
  otherWallets: Wallet[];

  onWalletChange: (
    senderWallet: WalletId, 
    receiverWallet: WalletId, 

    walletsFuture: (sender:Wallet, receiver:Wallet) => [Wallet, Wallet],
  ) => void;
}

export const WalletControlView: FC<WalletControllViewModel> = styled(
  ({
    className,
    main: thisWallet,

    otherWallets,
    onWalletChange
  }: WalletControllViewModel) => {

    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [distinationWalletId, setDistinationWalletId] = useState<WalletId | undefined>(undefined);

    return (
      <div className={className}>
        <form
          onSubmit={(e) =>
            {
              e.preventDefault();
              if(amount === undefined || distinationWalletId === undefined){
                alert( `送金先か送金額が未入力です！`);
                return;
              }

              onWalletChange(
                thisWallet.id, 
                distinationWalletId, 
                (thisWallet, distinationWallet)=>{ 
                  return thisWallet.sendMoney(distinationWallet, amount)
                } 
              );
            }
          }
        >
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => {
              setAmount(parseInt(e.target.value));
            }}
          />
          円
          <select onChange={(e)=>{
            
            const w = otherWallets.find((w)=>w.id === parseInt(e.target.value));
            if(w){
              console.log(w.id);
              setDistinationWalletId(w.id);
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