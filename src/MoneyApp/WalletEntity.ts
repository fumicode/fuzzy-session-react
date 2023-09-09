import Money from "./Money";


type WalletId = number;
  

export default class Wallet{

  constructor(
    readonly id: WalletId,
    readonly money: Money
  ){ }


  disposeMoney(amount:number): [Wallet, Money]{
    if(!(amount > 0)){
      throw new Error('amount は正の値である必要があります。');
    }

    const [money, rest] = this.money.split(amount);
    return [new Wallet(this.id, money), rest];
  }

  toString(){
    //カンマつけたい。
    return `Wallet #${this.id} ¥${this.money.amount.toString()}`;
  }
}