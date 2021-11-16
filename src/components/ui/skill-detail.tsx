import { i18n } from "@/i18n";
import { PlayerAction, SkillAction } from "@/types/action";
import { ISkill } from "@/types/Skill";

type SkillDetailUIParam = {
  skill: ISkill,
  onSkillAction: (action: SkillAction, skill: ISkill) => void;
}
export function SkillDetail({ skill, onSkillAction }: SkillDetailUIParam) {
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