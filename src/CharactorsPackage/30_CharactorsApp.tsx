import { FC, useContext } from "react";
import styled from "styled-components";
import ViewModel from "../00_Framework/00_ViewModel";
import Panel from "../00_Framework/Panel/02_Panel";
import Layer, { constantFunction } from "../00_Framework/Panel/02_Layer";
import SmartRect from "../00_Framework/Panel/01_SmartRect";
import { PanelBoxViewModel, useCharactorsRepos } from "./30_CharactorState";
import { CharactorsContext } from "./30_CharactorContext";
import CharactorEntity from "./20_CharactorEntity";
import { CharactorView } from "./20_CharactorView";

interface CharactorsAppViewModel extends ViewModel<{}> {
  //className,
  //main,

  onAppClick(): void;
}

//ViewをModelのClassに登録する初期化処理
CharactorEntity.registerView(CharactorView);

export const CharactorsApp: FC<CharactorsAppViewModel> = styled(
  ({ onAppClick }: CharactorsAppViewModel) => {
    //Appの処理

    const charactorsRepos = useContext(CharactorsContext);
    if (charactorsRepos === null) {
      return <div>charactorsRepos is null</div>;
    }

    const { charactorsRepo, charactorPBVMsRepo, charaZRepo } = charactorsRepos;

    const charaZ = charaZRepo.get();
    const charaZMax = charactorPBVMsRepo.getSize() - 1;

    const charactors = [...charactorsRepo.findAll()];

    return (
      <>
        {charactors.map((chara, index) => {
          const charaId = chara.id;
          if (!charaId) {
            return;
          }
          const PBVM = charactorPBVMsRepo.findById(charaId);
          if (!PBVM) {
            throw new Error(`charactor is undefined. charaId: ${charaId}`);
          }

          const colorHue = (index * 120) / charactorPBVMsRepo.getSize();
          return (
            <Layer
              zIndex={charaZ.get(PBVM.id.toString())}
              colorHue={colorHue}
              opacity={0.2}
              name={`Charactor #${charaId} ${chara.name}`}
              zIndexMax={charaZMax}
              key={PBVM.id.toString()}
              zScaler={constantFunction}
              onLayerHeaderClick={() => {
                onAppClick && onAppClick();
              }}
            >
              <Panel
                position={PBVM.position}
                size={PBVM.size}
                zIndex={charaZ.get(charaId.toString())}
                isActive={charaZ.isTop(PBVM.id.toString())}
                onMove={(smartRect: SmartRect) => {}}
                key={PBVM.id.toString()}
                onPanelClick={() => {
                  charaZRepo.dispatch((charaZ) =>
                    charaZ.moveToTop(PBVM.id.toString())
                  );
                  onAppClick && onAppClick();
                }}
              >
                {(renderedRect) => {
                  const CharaView = chara.getView();
                  return (
                  <CharaView
                    colorHue={colorHue}
                    onRelationOpen={(rel) => {
                      if (!renderedRect) {
                        return;
                      }
                      charactorPBVMsRepo.dispatchOne(
                        rel.targetId,
                        (charaBVM: PanelBoxViewModel): PanelBoxViewModel => {
                          const newPos = renderedRect.calcPositionToOpen(
                            charaBVM.size
                          );
                          return charaBVM.moveTo(newPos);
                        }
                      );
                      charaZRepo.dispatch((charaZ) =>
                        charaZ.moveToTop(rel.targetId.toString())
                      );
                    }}
                  ></CharaView>

                )}}
              </Panel>
            </Layer>
          );
        })}
      </>
    );
  }
)`
  width: 100%;
  min-height: 100%;
  background: white;
  position: relative;

  overflow: hidden;
  > .e-controlls {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }
`;

export default CharactorsApp;
