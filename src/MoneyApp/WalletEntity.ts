import Money from "./Money";

export class WalletId{
  constructor(
    readonly value: string
  ){ }

  toString(){
    return this.value;
  }

  equals(other: WalletId){
    return this.value === other.value;
  }
}
  

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

  receiveMoney(otherMoney: Money): Wallet{
    return new Wallet(this.id, this.money.merge(otherMoney));
  }

  sendMoney(otherWallet: Wallet, amount: number): [Wallet, Wallet]{
    if(otherWallet.id === this.id){
      throw new Error(`自分自身${this.id}に送金することはできません。`);
    }

    if(!(amount > 0)){
      throw new Error('amount は正の値である必要があります。');
    }
    const [thisWallet, money] = this.disposeMoney(amount);
    const otherWalletWithMoney = otherWallet.receiveMoney(money);
    return [thisWallet, otherWalletWithMoney];
  }


  toString(){
    //カンマつけたい。
    return `Wallet #${this.id} ¥${this.money.amount.toString()}`;
  }
}