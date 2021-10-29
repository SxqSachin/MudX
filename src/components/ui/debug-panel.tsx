import { useRecoilValue, } from "recoil";
import { GameEnvironmentAtom } from "../../store";
import { DataCallback, } from "@/types";
import { GameEnvironment, GamePanelType } from "@/types/game";
import { Enemies } from "@data/enemies";
import { showPanel } from "@/utils/game";


type DebugPanelParam = {
  onEnvironmentChange: DataCallback<GameEnvironment>,
  className: string;
}
export function DebugPanel({onEnvironmentChange, className}: DebugPanelParam) {
  const gameEnvironment = useRecoilValue(GameEnvironmentAtom);

  const increaseHP = (val: number) => {
    gameEnvironment.player.increaseStatus('curHP', val);

    onEnvironmentChange(gameEnvironment);
  }

  const toEvent = () => {
    gameEnvironment.panels = showPanel(gameEnvironment, "EVENT");
    onEnvironmentChange(gameEnvironment);
  }

  const enterBattle = () => {
    gameEnvironment.panels = showPanel(gameEnvironment, "BATTLE");
    gameEnvironment.enemy = Enemies.getGenerator('dummy')(gameEnvironment);

    onEnvironmentChange(gameEnvironment);
  }

  const chooseStory = () => {
    gameEnvironment.panels = showPanel(gameEnvironment, "STORY_CHOOSE");
    onEnvironmentChange(gameEnvironment);
  }

  const enterShop = () => {
    gameEnvironment.panels = showPanel(gameEnvironment, "TRADE");
    onEnvironmentChange(gameEnvironment);
  }

  return (
    <div className={"w-full " + className}>
      <button className="btn" onClick={() => increaseHP(1)}> Increase HP </button>
      <button className="btn" onClick={toEvent}> ToEvent </button>
      <button className="btn" onClick={enterBattle}> EnterBattle </button>
      <button className="btn" onClick={chooseStory}> ChooseStory </button>
      <button className="btn" onClick={enterShop}> EnterShop </button>
    </div>
  );
}