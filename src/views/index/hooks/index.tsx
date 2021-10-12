import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { GameEvents, Items } from "../../../data";
import { Unit } from "../../../models/Unit";
import { GameEnvironmentAtom } from "../../../store";

export function useInit() {
  const [gameEnvironment, setGameEnvironment] = useRecoilState(GameEnvironmentAtom);

  gameEnvironment.panels.add('EVENT');
  gameEnvironment.event = GameEvents.get('test-center');

  const player = Unit.create('player');
  player.increaseStatus('phyAtk', 3);

  const sword = Items.get('sword');
  const sword2 = Items.get('sword');
  player.addItem(sword).equipItem(sword);
  player.addItem(sword2).equipItem(sword2);

  const enemy = Unit.create('enemy');

  gameEnvironment.player = player;
  gameEnvironment.enemy = enemy;
}