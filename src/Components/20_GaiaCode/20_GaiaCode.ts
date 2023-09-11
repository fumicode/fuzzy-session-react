




export type SevenNumbers = [number, number, number, number, number, number, number];
export type ThreeRows = [SevenNumbers, SevenNumbers, SevenNumbers];


//ガイアコードとは:
export default class GaiaCode{
  readonly code: ThreeRows;

  constructor(code: ThreeRows){
    this.code = code;
  }
}
