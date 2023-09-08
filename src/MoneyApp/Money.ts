export default class Money{
  constructor(
    readonly amount: number
  ){ }

  split(splittingAmount:number): [Money, Money]{
    if(!(splittingAmount > 0)){
      throw new Error('splittingAmout は正の値である必要があります。');
    }
    return [new Money(this.amount - splittingAmount), new Money(splittingAmount)];
  }

  merge(otherMoney: Money): Money{
    return new Money(this.amount + otherMoney.amount);
  }

  toString(){
    //カンマつけたい。
    return '¥'+this.amount.toString();
  }
}