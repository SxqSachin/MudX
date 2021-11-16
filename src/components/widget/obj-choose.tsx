import { KVPair } from "@/types";

type ObjectChooseUIParam<T extends KVPair<T>> = {
  options: T[];
  multiple?: boolean;
  onChoose: (options: T[]) => void;
}
export function ObjectChooseUI<T extends KVPair<T>>({options, multiple, onChoose}: ObjectChooseUIParam<T>) {
  if (!multiple) {
    multiple = false;
  }

  return <div>
    {
      options.map(option => {
        return (
          <div className="px-4 py-2 border rounded-md cursor-pointer" onClick={() => onChoose([option])}> { option.value } </div>
        )
      })
    }

    </div>
}