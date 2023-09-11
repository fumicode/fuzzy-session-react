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

  disposeMoney(disposingAmount:number): [Wallet, Money]{
    if(!(disposingAmount > 0)){
      throw new Error('放棄する金額は正の値である必要があります。');
    }

    const [money, rest] = this.money.split(disposingAmount);
    return [new Wallet(this.id, money), rest];
  }

  receiveMoney(otherMoney: Money): Wallet{
    return new Wallet(this.id, this.money.merge(otherMoney));
  }

  sendMoney(otherWallet: Wallet, amount: number): [Wallet, Wallet]{
    if(otherWallet.id === this.id){
      throw new Error(`自分自身（${this.id}）に送金することはできません。`);
    }

    if(!(amount > 0)){
      throw new Error('送信金額は正の値である必要があります。');
    }

    if(!(this.money.amount >= amount)){
      throw new Error(`残高が足りません。残高:${this.money.toString()}, 送信金額: ${new Money(amount).toString()}`);
    }

    const [thisWallet, money] = this.disposeMoney(amount);
    const otherWalletWithMoney = otherWallet.receiveMoney(money);
    return [thisWallet, otherWalletWithMoney];
  }


  toString(){
    //TODO: 金額にカンマつけたい。そういうutilityないかな？
    return `[Wallet #${this.id} ¥${this.money.amount.toString()}]`;
  }
}