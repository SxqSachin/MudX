import { useRecoilValue, } from "recoil";
import { GameEnvironmentAtom } from "../../store";
import { DataCallback, } from "@/types";
import { GameEnvironment, GamePanelType } from "@/types/game";
import { Enemies } from "@data/enemies";
import { showPanel } from "@/utils/game";
import { Unit } from "@/models/Unit";
import { Items } from "@data";
import { XStorage } from "@/core/storage";
import { IItem, ItemID } from "@/types/Item";


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
    gameEnvironment.trade = {
      priceList: {
        'shield': {
          enterPrice: {
            amount: 10,
            subject: 'gold-icon',
          },
          salePrice: {
            amount: 20,
            subject: 'gold-icon',
          }
        },
        'sword': {
          enterPrice: {
            amount: 10,
            subject: 'gold-icon',
          },
          salePrice: {
            amount: 20,
            subject: 'gold-icon',
          }
        },
      },
      shopkeeper: () => {
        const unit = Unit.create('debug shop');

        let itemStorageString = XStorage.getItem('debug shop');
        if (!itemStorageString) {
          itemStorageString = (() => {
            let res: { [id in ItemID]: number } = {};
            Items.keys().forEach(key => {
              res[key] = 999;
            });

            return JSON.stringify(res);
          })();
        }

        const itemStorage: { [id in ItemID]: number } = JSON.parse(itemStorageString);

        Object.keys(itemStorage).forEach(itemID => {
          unit.addItemByID(itemID, itemStorage[itemID]);
        })

        return unit;
      },
      onDealDone: unit => {
        const item = (() => {
          const res: { [id in ItemID]: number } = {};
          Object.keys(unit.items).map(itemID=> {
            res[itemID] = unit.items[itemID].length;
          });

          return res;
        })();
        XStorage.setItem('debug shop', JSON.stringify(item));
      },
    }
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