import Money from "./Money";


type WalletId = number;
  

export default class Wallet{

  constructor(
    readonly id: WalletId,
    readonly money: Money
  ){ }


  toString(){
    //カンマつけたい。
    return `Wallet #${this.id} ¥${this.money.amount.toString()}`;
  }
}