import { XStorage } from "@/core/storage";
import { ItemID } from "@/types/Item";
import { XID } from "@/types/Object";
import { Items } from "@data/items";

export function getShopStock(
  shopKey: XID,
  defStock: { [id in ItemID]: number } = {}
) {
  let itemStorageString = XStorage.getItem(shopKey);

  if (!itemStorageString) {
    itemStorageString = JSON.stringify(defStock);
  }

  const itemStorage: { [id in ItemID]: number } = JSON.parse(itemStorageString);

  return itemStorage;
}
