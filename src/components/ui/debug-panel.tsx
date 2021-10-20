import { useRecoilValue, } from "recoil";
import { GameEnvironmentAtom } from "../../store";
import { DataCallback, } from "@/types";
import { GameEnvironment } from "@/types/game";
import { Enemies } from "@data/enemies";


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

  const enterBattle = () => {
    gameEnvironment.panels.delete('EVENT');
    gameEnvironment.panels.add('BATTLE');
    gameEnvironment.enemy = Enemies.getGenerator('dummy')(gameEnvironment);

    onEnvironmentChange(gameEnvironment);
  }

  const leaveBattle = () => {
    gameEnvironment.panels.delete('BATTLE');
    gameEnvironment.panels.add('EVENT');

    onEnvironmentChange(gameEnvironment);
  }

  const chooseStory = () => {
    gameEnvironment.panels.delete('BATTLE');
    gameEnvironment.panels.delete('EVENT');
    gameEnvironment.panels.add('STORY_CHOOSE');

    onEnvironmentChange(gameEnvironment);
  }

  return (
    <div className={"w-full " + className}>
      <button className="btn" onClick={() => increaseHP(1)}> Increase HP </button>
      <button className="btn" onClick={enterBattle}> EnterBattle </button>
      <button className="btn" onClick={leaveBattle}> LeaveBattle </button>
      <button className="btn" onClick={chooseStory}> ChooseStory </button>
    </div>
  );
}