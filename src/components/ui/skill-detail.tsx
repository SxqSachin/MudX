import { i18n } from "@/i18n";
import { PlayerAction, SkillAction } from "@/types/action";
import { ISkill } from "@/types/Skill";
import item from "@data/items/script/base_amulet";
import { PopupParam, Popup } from "../widget/popup";
import { ItemDetailPanel } from "./item-detail";

type SkillDetailUIParam = {
  skill: ISkill,
  onSkillAction: (action: SkillAction, skill: ISkill) => void;
}
export function SkillDetailUI({ skill, onSkillAction }: SkillDetailUIParam) {
  return (
    <div>
      <p>
        {skill.data.name}
      </p>
      <hr />
      <div>
        {skill.data.chooseTarget &&
          <button className="btn" onClick={() => onSkillAction("CAST_SKILL", skill)}>
            {i18n('castSpell')}
          </button>
        }
        {!skill.data.chooseTarget &&
          <button className="btn" onClick={() => onSkillAction("CAST_SKILL", skill)}>
            {i18n('castSpell')}
          </button>
        }
      </div>
    </div>
  );
}

export function SkillDetailPopup({
  skill,
  onSkillAction,
  onClose,
}: SkillDetailUIParam & PopupParam) {
  return (
    <Popup onClose={onClose}>
      <SkillDetailUI
        skill={skill}
        onSkillAction={onSkillAction}
      ></SkillDetailUI>
    </Popup>
  );
}
