import styled from "styled-components";
import ViewModel from "../00_Framework/00_ViewModel";
import Entity, { Id, StringId } from "../00_Framework/00_Entity";
import { Action } from "../00_Framework/00_Action";
import { FC, useContext } from "react";
import { CharactorsContext } from "./30_CharactorContext";
import CharactorEntity, { CharactorRelation, CharactorViewModel } from "./20_CharactorEntity";
export type RelationType = string;


export const CharactorView = ({
  className,
  main: charactor,
  colorHue,
  onRelationOpen,
}: CharactorViewModel) => {
  const charactorsRepo = useContext(CharactorsContext);

  return (
    <CharactorStyledView
      main={charactor}
      colorHue={colorHue}
      onCountUp={
        ()=>{
        charactorsRepo?.charactorsRepo.dispatchOne(
          charactor.id,
          (chara: CharactorEntity) => {
            return chara.countUp();
          }
        );
        }
      } 
      onCountDown={
        ()=>{
          charactorsRepo?.charactorsRepo.dispatchOne(
            charactor.id,
            (chara: CharactorEntity) => {
              return chara.countDown();
            }
          );
        }
      } 
      onRelationOpen={(rel)=>onRelationOpen?.(rel)}
    />
  );
}


const CharactorStyledView = styled(
  ({
    className,
    main: charactor,
    colorHue,
    onRelationOpen,
    onCountUp,
    onCountDown,

  }: CharactorViewModel) => {
    return (
      <article className={className}>
        <header className="e-header">
          <p className="e-type-id">Charactor #{charactor.id.toString()}</p>
          <h2 className="e-title">{charactor.name}</h2>
        </header>
        <div
          className="e-body"
          style={{ background: `hsl(${colorHue}, 50%, 50%)` }}
        >
          {charactor.relatedCharactors.map((relation) => {
            return (
              <div key={relation.targetId.toString()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); //これがないと親のonClickが呼ばれてしまう
                    onRelationOpen?.(relation);
                  }}
                >
                  {relation.relation}:{relation.targetName}
                </button>
              </div>
            );
          })}

          <p>
            <button
              onClick={() => onCountDown?.() }
            >
              -
            </button>
            {charactor.count}
            <button
              onClick={() => onCountUp?.() }
            >
              +
            </button>
          </p>
        </div>
      </article>
    );
  }
)`
  display: flex;
  flex-direction: column;

  > .e-header {
    padding: 5px;
    //flex-basis: 0;
    flex-grow: 0;
    flex-shrink: 0;

    background: white;
    cursor: move;
    //選択させない
    user-select: none;

    > .e-type-id {
      margin: 0;
      padding: 0;
      line-height: 1;
      font-size: 0.8em;
    }

    > .e-title {
      margin: 0;
      padding: 0;
      line-height: 1;
    }
  }

  > .e-body {
    //flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1;

    padding: 5px;

    overflow: scroll;
    transition: background 0.9s;
  }
  display: contents;
`;
