
import classNames from "classnames";
import ViewModel from "../00_ViewModel";

import { FC } from "react";
import styled from "styled-components";



export type SevenNumbers = [number, number, number, number, number, number, number];
export type ThreeRows = [SevenNumbers, SevenNumbers, SevenNumbers];


//ガイアコードとは:
export default class GaiaCode{
  readonly code: ThreeRows;

  constructor(code: ThreeRows){
    this.code = code;
  }
}

class GaiaCodeViewModel implements ViewModel<GaiaCode>{
  constructor(
    readonly main: GaiaCode,
    readonly className?: string,
  ){ }
}


export const GaiaCodeView: FC<GaiaCodeViewModel> = styled(({
  main: gaiaCode,
  className: c
}: GaiaCodeViewModel) => {
  return (
  <table className={c}>

    { gaiaCode.code.map((row, i) =>
      <tr className={classNames("e-row",{"m-center": i === 1})} key={i}>

        {row.map((cell, i) =>
          <td className="e-cell" style={{backgroundColor: `hsl(${cell * 20 + 30}, 100%, 70%)`}}>
            {cell}
          </td>
        )}
      </tr>
    ) }

  </table>
  );
})`
border-collapse: collapse;
> .e-row{
  > .e-cell{
    border: 1px solid black;
    width: 20px;
    height: 20px;
    text-align: center;

    &.m-center{
      border: 3px solid;

    }
  }

}

`;