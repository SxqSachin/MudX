import { ItemAction } from "../../types/action";
import { IItem } from "../../types/Item";
import { Popup, PopupParam } from "../widget/popup";

type ItemDetailUIParam = {
  item: IItem;
  onItemAction?: (action: ItemAction, item: IItem) => void;
};
export function ItemDetailPanel({ item, onItemAction }: ItemDetailUIParam) {
  return (
    <div>
      <p>
        {item.data.name}({item.data.xid})
      </p>
      <hr />
      <div>
        {item.data.isUseable && (
          <button className="btn" onClick={() => onItemAction?.("USE", item)}>
            Use
          </button>
        )}
        {item.data.isEquipable && item.data.isEquipped && (
          <button
            className="btn"
            onClick={() => onItemAction?.("UNEQUIP", item)}
          >
            Unequip
          </button>
        )}
        {item.data.isEquipable && !item.data.isEquipped && (
          <button className="btn" onClick={() => onItemAction?.("EQUIP", item)}>
            Equip
          </button>
        )}
      </div>
    </div>
  );
}

export function ItemDetailPopup({
  item,
  onItemAction,
  onClose,
}: ItemDetailUIParam & PopupParam) {
  return (
    <Popup onClose={onClose}>
      <ItemDetailPanel
        item={item}
        onItemAction={onItemAction}
      ></ItemDetailPanel>
    </Popup>
  );
}
