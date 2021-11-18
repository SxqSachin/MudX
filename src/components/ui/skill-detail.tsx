import { i18n } from "@/i18n";
import { KVPair } from "@/types";
import { PlayerAction, PlayerActionCallback, SkillAction } from "@/types/action";
import { GameEnvironment } from "@/types/game";
import { ISkill } from "@/types/Skill";
import { IUnit } from "@/types/Unit";
import { calcFunctionalVal } from "@/utils";
import item from "@data/items/script/base_amulet";
import { useState } from "react";
import { ObjectChoosePopup, UnitChoosePopup } from "../widget/obj-choose";
import { PopupParam, Popup } from "../widget/popup";
import { ItemDetailPanel } from "./item-detail";

type SkillDetailUIParam = {
  unit: IUnit,
  skill: ISkill,
  onSkillAction: PlayerActionCallback,
  getTargets: () => KVPair<IUnit>[],
}
export function SkillDetailUI({ unit, skill, onSkillAction, getTargets }: SkillDetailUIParam) {
  const [showTargetChooseUI, setShowTargetChooseUI] = useState(false);

  const onChooseTarget = (target: IUnit[]) => {
    onSkillAction("CAST_SKILL", {
      target,
      skill,
    });
  }

  return (
    <div className="w-full h-full">
      <h2 className="text-xl mb-6">{skill.data.name}</h2>
      <div>
        <p className="mb-1 opacity-70">技能描述：</p>
        <p>{calcFunctionalVal(skill.data.description, unit)}</p>
      </div>
      <div className="absolute bottom-0">
        {skill.data.chooseTarget && (
          <button className="btn" onClick={() => setShowTargetChooseUI(true)}>
            {i18n("castSpell")}
          </button>
        )}
        {!skill.data.chooseTarget && (
          <button className="btn" onClick={() => onChooseTarget([])}>
            {i18n("castSpell")}
          </button>
        )}
      </div>

      {showTargetChooseUI && (
        <UnitChoosePopup
          onClose={() => setShowTargetChooseUI(false)}
          onChoose={onChooseTarget}
          options={getTargets()}
        ></UnitChoosePopup>
      )}
    </div>
  );
}

export function SkillDetailPopup({
  unit,
  skill,
  onSkillAction,
  onClose,
  getTargets,
}: SkillDetailUIParam & PopupParam) {
  return (
    <Popup onClose={onClose}>
      <SkillDetailUI
        unit={unit}
        skill={skill}
        onSkillAction={onSkillAction}
        getTargets={getTargets}
      ></SkillDetailUI>
    </Popup>
  );
}
