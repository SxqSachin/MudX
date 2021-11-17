import { i18n } from "@/i18n";
import { KVPair } from "@/types";
import { PlayerAction, PlayerActionCallback, SkillAction } from "@/types/action";
import { GameEnvironment } from "@/types/game";
import { ISkill } from "@/types/Skill";
import { IUnit } from "@/types/Unit";
import item from "@data/items/script/base_amulet";
import { useState } from "react";
import { ObjectChoosePopup, UnitChoosePopup } from "../widget/obj-choose";
import { PopupParam, Popup } from "../widget/popup";
import { ItemDetailPanel } from "./item-detail";

type SkillDetailUIParam = {
  skill: ISkill,
  onSkillAction: PlayerActionCallback,
  getTargets: () => KVPair<IUnit>[],
}
export function SkillDetailUI({ skill, onSkillAction, getTargets }: SkillDetailUIParam) {
  const [showTargetChooseUI, setShowTargetChooseUI] = useState(false);

  const onChooseTarget = (target: IUnit[]) => {
    onSkillAction("CAST_SKILL", {
      target,
      skill,
    });
  }

  return (
    <div>
      <p>
        {skill.data.name}
      </p>
      <hr />
      <div>
        {skill.data.chooseTarget &&
          <button className="btn" onClick={() => setShowTargetChooseUI(true)}>
            {i18n('castSpell')}
          </button>
        }
        {!skill.data.chooseTarget &&
          <button className="btn" onClick={() => onChooseTarget([])}>
            {i18n('castSpell')}
          </button>
        }
      </div>

      {showTargetChooseUI && <UnitChoosePopup onClose={() => setShowTargetChooseUI(false)} onChoose={onChooseTarget} options={getTargets()}></UnitChoosePopup> }
    </div>
  );
}

export function SkillDetailPopup({
  skill,
  onSkillAction,
  onClose,
  getTargets,
}: SkillDetailUIParam & PopupParam) {
  return (
    <Popup onClose={onClose}>
      <SkillDetailUI
        skill={skill}
        onSkillAction={onSkillAction}
        getTargets={getTargets}
      ></SkillDetailUI>
    </Popup>
  );
}
