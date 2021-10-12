import { useRecoilValue, } from "recoil";
import { GameEnvironmentAtom } from "../../store";
import { DataCallback, } from "../../types";
import { GameEnvironment } from "../../types/game";


type DebugPanelParam = {
  onEnvironmentChange: DataCallback<GameEnvironment>,
}
export function DebugPanel({onEnvironmentChange}: DebugPanelParam) {
  const gameEnvironment = useRecoilValue(GameEnvironmentAtom);

  const increaseHP = (val: number) => {
    gameEnvironment.player.increaseStatus('curHP', val);

    onEnvironmentChange(gameEnvironment);
  }

  const enterBattle = () => {
    gameEnvironment.panels.delete('EVENT');
    if (!gameEnvironment.panels.has('BATTLE')) {
      gameEnvironment.panels.add('BATTLE');
    }

    onEnvironmentChange(gameEnvironment);
  }

  const leaveBattle = () => {
    gameEnvironment.panels.delete('BATTLE');
    if (!gameEnvironment.panels.has('EVENT')) {
      gameEnvironment.panels.add('EVENT');
    }

    onEnvironmentChange(gameEnvironment);
  }


  return (
    <div className="w-full">
      <button className="btn" onClick={() => increaseHP(1)}> Increase HP </button>
      <button className="btn" onClick={enterBattle}> EnterBattle </button>
      <button className="btn" onClick={leaveBattle}> LeaveBattle </button>
    </div>
  );
}