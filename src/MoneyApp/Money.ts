
export default class Money{
  constructor(
    readonly amount: number
  ){ }

  subtract(amount:number){
    return new Money(this.amount - amount);
  }

  toString(){
    return '¥'+this.amount.toString();
  }
}