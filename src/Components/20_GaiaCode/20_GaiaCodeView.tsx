
import classNames from "classnames";
import ViewModel from "../../00_Framework/00_ViewModel";

import { FC } from "react";
import styled from "styled-components";
import GaiaCode from "./20_GaiaCode";





class GaiaCodeViewModel implements ViewModel<GaiaCode>{
  constructor(
    readonly main: GaiaCode,
    readonly className?: string,
  ){ }
}


const GaiaCodeView: FC<GaiaCodeViewModel> = styled(({
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

export default GaiaCodeView;