import { BattlePanel } from "@/components/ui/battle-panel";
import { Message } from "@/core/message";
import { battleEndEvent } from "@/models/event/battle-end";
import { PlayerActionData, BattleAction, PlayerActionCallback } from "@/types/action";
import { BattleParse } from "@/types/battle";
import { GameEnvironment } from "@/types/game";
import { delay, runAsyncGenerate, waitBattleParseDelay } from "@/utils";
import { isPanelVisible } from "@/utils/game";
import { useEffect } from "react";
import { MainPanelParam } from ".";

type BattleActionMapParam = { gameEnvironment: GameEnvironment, data: Partial<PlayerActionData> };
const battleActionMap: {
  [action in (BattleParse | BattleAction)]: (
    obj: BattleActionMapParam
  ) => AsyncGenerator<BattleActionMapParam, BattleActionMapParam, BattleActionMapParam>;
} = {
  LEAVE_BATTLE: async function* ({ gameEnvironment, data }) {
    gameEnvironment.battle = {
      isInBattle: false,
      round: 0,
      curRoundOwner: "NONE",
      playerCanDoAction: false,
    };

    return { gameEnvironment, data }
  },
  ENTER_BATTLE: async function* ({ gameEnvironment, data }) {
    const { player, enemy } = gameEnvironment;
    gameEnvironment.battle = {
      isInBattle: true,
      round: 1,
      curRoundOwner: "NONE",
      playerCanDoAction: false,
    };

    Message.push("=========================");
    Message.push("进入战斗");
    await waitBattleParseDelay();
    const isPlayerFirst = enemy.status.speed <= player.status.speed;
    Message.push(
      `速度对比：玩家(${player.status.speed}) vs 对方(${enemy.status.speed})。${
        isPlayerFirst ? "玩家" : "对方"
      }先手。`
    );
    await waitBattleParseDelay();

    const roundOwner = isPlayerFirst ? "PLAYER" : "ENEMY";
    gameEnvironment.battle.curRoundOwner = roundOwner;

    return { gameEnvironment, data }
  },
  ROUND_START: async function* ({ gameEnvironment, data }) {
    gameEnvironment.battle.round += 1;

    return { gameEnvironment, data }
  },
  ROUND_END: async function* ({ gameEnvironment, data }) {
    const { player, enemy } = gameEnvironment;
    if (enemy.status.curHP <= 0) {
      gameEnvironment.event = battleEndEvent({ enemy }, gameEnvironment);

      Message.push(`你战胜了 ${enemy.name}`);
      Message.push(`战斗结束`);
      Message.push(`=========================`);
      await waitBattleParseDelay();

      gameEnvironment.panels.shift();
      gameEnvironment.panels.unshift("EVENT");
    } else {
      if (gameEnvironment.battle.curRoundOwner === "ENEMY") {
        gameEnvironment.battle.curRoundOwner = "PLAYER";
      } else if (gameEnvironment.battle.curRoundOwner === "PLAYER") {
        gameEnvironment.battle.curRoundOwner = "ENEMY";
      }
    }

    return { gameEnvironment, data }
  },
  PLAYER_ROUND_START: async function* ({ gameEnvironment, data }) {
    const { player, enemy } = gameEnvironment;
    await player.fire("roundStart", { source: player, target: enemy });
    Message.push("玩家回合开始");
    gameEnvironment.battle.playerCanDoAction = true;

    return { gameEnvironment, data }
  },
  PLAYER_ROUND_END: async function* ({ gameEnvironment, data }) {
    const { player, enemy } = gameEnvironment;
    await player.fire("roundEnd", { source: player, target: enemy });

    gameEnvironment.battle.playerCanDoAction = false;
    yield { gameEnvironment, data };
    await waitBattleParseDelay();

    Message.push("玩家回合结束");

    await waitBattleParseDelay();

    yield { gameEnvironment, data } = yield* await battleActionMap.ROUND_END({ gameEnvironment, data });

    await waitBattleParseDelay();

    return { gameEnvironment, data }
  },
  ENEMY_ROUND_START: async function* ({ gameEnvironment, data }) {
    const { player, enemy } = gameEnvironment;
    await enemy.fire("roundStart", { source: enemy, target: player });
    Message.push("敌方回合开始");

    await waitBattleParseDelay();

    await enemy.fire("aiRoundStart", { source: enemy, target: player });
    yield { gameEnvironment, data };

    await waitBattleParseDelay();

    yield { gameEnvironment, data } = yield* await battleActionMap.ENEMY_ROUND_END({ gameEnvironment, data });

    return { gameEnvironment, data }
  },
  ENEMY_ROUND_END: async function* ({ gameEnvironment, data }) {
    const { player, enemy } = gameEnvironment;
    await enemy.fire("roundEnd", { source: enemy, target: player });
    Message.push("敌方回合结束");
    await waitBattleParseDelay();
    yield { gameEnvironment, data } = yield* await battleActionMap.ROUND_END({ gameEnvironment, data });

    return { gameEnvironment, data }
  },

  ATTACK: async function* ({ gameEnvironment, data }) {
    const { player, enemy } = gameEnvironment;
    await player.attack(enemy);

    yield { gameEnvironment, data };

    yield { gameEnvironment, data } = yield* await battleActionMap.PLAYER_ROUND_END({ gameEnvironment, data });

    return { gameEnvironment, data };
  },
  CAST_SKILL: async function* ({ gameEnvironment, data }) {
    for (const target of data.target!) {
      const generator = await gameEnvironment.player.castSkill(data.skill!.data.id, target);

      for await (const iterator of generator) {
        yield { gameEnvironment, data };
      }
    }

    yield { gameEnvironment, data } = yield* await battleActionMap.PLAYER_ROUND_END({ gameEnvironment, data });

    return { gameEnvironment, data };
  }
};

export const BattlePanelHOC = ({
  gameEnvironment,
  applyEnvironment,
}: MainPanelParam) => {
  const { player, enemy, panels, battle } = gameEnvironment;

  useEffect(() => {
    (async () => {
      if (isPanelVisible(gameEnvironment, "BATTLE")) {
        await runAsyncGenerate(battleActionMap.ENTER_BATTLE, { gameEnvironment, data: {} }, obj => {
          gameEnvironment = obj.gameEnvironment;
          applyEnvironment(gameEnvironment);
        })
      } else {
        await runAsyncGenerate(battleActionMap.LEAVE_BATTLE, { gameEnvironment, data: {} }, obj => {
          gameEnvironment = obj.gameEnvironment;
          applyEnvironment(gameEnvironment);
        })
      }
    })();
  }, [panels[0]]);

  useEffect(() => {
    (async () => {
      switch (gameEnvironment.battle.curRoundOwner) {
        case "PLAYER":
          gameEnvironment.battle.curRoundOwner = "PLAYER";
          await runAsyncGenerate(battleActionMap.ROUND_START, { gameEnvironment, data: {} }, obj => {
            gameEnvironment = obj.gameEnvironment;
            applyEnvironment(gameEnvironment);
          })
          await runAsyncGenerate(battleActionMap.PLAYER_ROUND_START, { gameEnvironment, data: {} }, obj => {
            gameEnvironment = obj.gameEnvironment;
            applyEnvironment(gameEnvironment);
          })

          break;
        case "ENEMY":
          gameEnvironment.battle.curRoundOwner = "ENEMY";
          await runAsyncGenerate(battleActionMap.ROUND_START, { gameEnvironment, data: {} }, obj => {
            gameEnvironment = obj.gameEnvironment;
            applyEnvironment(gameEnvironment);
          })
          await runAsyncGenerate(battleActionMap.ENEMY_ROUND_START, { gameEnvironment, data: {} }, obj => {
            gameEnvironment = obj.gameEnvironment;
            applyEnvironment(gameEnvironment);
          })

          break;
        case "NONE":
        default:
          break;
      }
    })();
  }, [gameEnvironment.battle.curRoundOwner]);

  const handleBattleAction: PlayerActionCallback = async (action, data) => {
    const { player, enemy } = gameEnvironment;
    if (!enemy) {
      return;
    }

    console.log(action, data);
    if (action !== 'CAST_SKILL' && action !== 'ATTACK') {
      return;
    }

    await runAsyncGenerate(battleActionMap[action], { gameEnvironment, data }, obj => {
      gameEnvironment = obj.gameEnvironment;
      applyEnvironment(gameEnvironment);
    })

    applyEnvironment(gameEnvironment);
  };

  const calcBtnState = (action: string) => {
    return gameEnvironment.battle.playerCanDoAction;
  };

  if (panels[0] != "BATTLE") {
    return null;
  }

  return (
    <BattlePanel
      calcBtnState={calcBtnState}
      player={player}
      enemy={enemy}
      onAction={handleBattleAction}
    ></BattlePanel>
  );
};