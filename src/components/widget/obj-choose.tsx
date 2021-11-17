import { KVPair } from "@/types";
import { IUnit } from "@/types/Unit";
import { useState } from "react";
import { Popup, PopupParam } from "./popup";

type ObjectChooseUIParam<T> = {
  options: KVPair<T>[];
  multiple?: boolean;
  onChoose: (options: T[]) => void;
}
export function ObjectChooseUI<T>({options, multiple, onChoose}: ObjectChooseUIParam<T>) {
  const [value, setValue] = useState<T[]>([]);

  const onChooseOption = (option: T) => {
    setValue(val => {
      if (val.includes(option)) {
        val = val.filter(v => v != option)
      } else {
        val.push(option);
        val = [...new Set(val)];
      }

      return val;
    });
  }

  const onSubmit = () => {
    onChoose(value);
    setValue([]);
  }

  if (!multiple) {
    multiple = false;
  }

  return <div>
    <div>
      {options.filter(option => !!option.value && !!option.key).map((option) => {
        return (
          <div
            className={"px-4 py-2 border rounded-md cursor-pointer" + (value.includes(option.value) ? " bg-black": '')}
            onClick={() => onChooseOption(option.value)}
            key={option.key}
          >
            {option.label}
          </div>
        );
      })}
    </div>
    <button className="btn" onClick={onSubmit}></button>
  </div>;
}

export function ObjectChoosePopup<T>({options, multiple, onChoose, onClose}: ObjectChooseUIParam<T> & PopupParam) {
  return (
    <Popup onClose={onClose}>
      <ObjectChooseUI
        onChoose={onChoose}
        options={options}
        multiple={multiple}
      ></ObjectChooseUI>
    </Popup>
  );
}
export const UnitChoosePopup = ({
  options,
  multiple,
  onChoose,
  onClose,
}: ObjectChooseUIParam<IUnit> & PopupParam) => ObjectChoosePopup<IUnit>({options, multiple, onChoose, onClose});