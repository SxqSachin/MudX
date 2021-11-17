import { useCallback, useEffect, } from "react";
import { DataCallback, VoidCallback, } from "@/types";
import { BattleAction } from "@/types/battle";
import { IUnit } from "@/types/Unit";
import { ProgressBar } from "../widget/progress-bar";
import { noop } from "@/utils";
import { i18n } from "@/i18n";
import { PlayerAction, PlayerActionCallback } from "@/types/action";
import { ISkill } from "@/types/Skill";
import { UnitChoosePopup } from "../widget/obj-choose";
import { useState } from "react";

export type BattleActionCalbackParam = { action: BattleAction; ext: { id: string } };
type BattlePanelParam = {
  player: IUnit;
  enemy: IUnit;

  calcBtnState: (btnKey: string) => boolean;

  onAction: PlayerActionCallback;
};

type BattleBtn = {
  action: 'CAST_SKILL';
  label: string;
  id: string;
  skill: ISkill;
} | {
  action: Exclude<PlayerAction, 'CAST_SKILL'>;
  label: string;
  id: string;
}

export function BattlePanel({player, enemy, onAction, calcBtnState}: BattlePanelParam) {
  const [chooseTargetBtn, setChooseTargetBtn] = useState<BattleBtn | null>(null);

  const handleAction: PlayerActionCallback = (action, data) => {
    onAction(action, data);
  }

  const calcOnClick: (btn: BattleBtn) => VoidCallback = (btn: BattleBtn) => {
    const isBtnEnable = calcBtnState(btn.action);

    let onClick: VoidCallback = noop;

    if (isBtnEnable) {
      if (btn.action === "ATTACK") {
        onClick = () =>
          handleAction("ATTACK", {
            target: [enemy],
          });
      } else if (btn.action === "CAST_SKILL") {
        if (!btn.skill.data.chooseTarget) {
          onClick = () =>
            handleAction("CAST_SKILL", {
              skill: btn.skill,
              target: [enemy],
            });
        } else {
          onClick = () =>
            setChooseTargetBtn(btn);
        }
      }
    }

    return onClick;
  };

  const btnList: BattleBtn[] = [
    { action: "ATTACK", label: "btn_attack", id: "attack" },
  ];
  Object.keys(player.skills).forEach(key => {
    btnList.push({
      action: "CAST_SKILL",
      id: key,
      label: player.skills[key].data.name,
      skill: player.skills[key],
    });
  })

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between">
        <div className="w-28">
          <div>{player.name}</div>
          <ProgressBar
            max={player.status.maxHP}
            cur={player.status.curHP}
          ></ProgressBar>
        </div>
        <div className="w-28">
          <div>{enemy.name}</div>
          <ProgressBar
            max={enemy.status.maxHP}
            cur={enemy.status.curHP}
            direction="right"
          ></ProgressBar>
        </div>
      </div>
      <div className="">
        {btnList.map((btn) => {
          const isBtnEnable = calcBtnState(btn.action);

          let onClick: VoidCallback = calcOnClick(btn);;

          const btnClass = `btn ${
            isBtnEnable ? "" : "btn--disabled cursor-not-allowed"
          }`;
          return (
            <button
              key={btn.action + btn.id}
              className={btnClass}
              onClick={onClick}
            >
              {i18n(btn.label, btn.label)}
            </button>
          );
        })}
      </div>

      {chooseTargetBtn && (
        <UnitChoosePopup
          onClose={() => setChooseTargetBtn(null)}
          onChoose={target => {
            const btn = chooseTargetBtn;
            setChooseTargetBtn(null)
            if (btn.action === "ATTACK") {
              handleAction("ATTACK", {
                target: [enemy],
              });
            } else if (btn.action === "CAST_SKILL") {
              if (!btn.skill.data.chooseTarget) {
                handleAction("CAST_SKILL", {
                  skill: btn.skill,
                  target: [enemy],
                });
              } else {
                console.log(target);
                handleAction("CAST_SKILL", {
                  skill: btn.skill,
                  target,
                });
              }
            }
          }}
          options={[
            {
              key: player.xid,
              value: player,
              label: player.name,
            },
            {
              key: enemy.xid,
              value: enemy,
              label: enemy.name,
            },
          ]}
        ></UnitChoosePopup>
      )}
    </div>
  );
}