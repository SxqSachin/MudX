import { i18n } from "@/i18n";
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
  const [value, setValue] = useState<string[]>([]);

  const onChooseOption = (option: string) => {
    let val = value;
    if (val.includes(option)) {
      val = val.filter(v => v != option)
    } else {
      val.push(option);
    }

    val = [...new Set(val)];
    setValue(val);
  }

  const onSubmit = () => {
    const val = value
      .map((key) => {
        const res = options.find((option) => option.key === key);
        if (!res) {
          return null;
        }
        return res.value;
      })
      .filter((val) => val !== null) as T[];

    console.log(val, value);

    onChoose(val);
    setValue([]);
  }

  if (!multiple) {
    multiple = false;
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        {options
          .filter((option) => !!option.value && !!option.key)
          .map((option) => {
            const cls =
              "px-4 py-2 mb-2 border border-gray-400 rounded-md cursor-pointer" +
              (value.includes(option.key) ? " bg-blue-300 border-blue-300 text-white" : "");
            return (
              <div
                className={cls}
                onClick={() => onChooseOption(option.key)}
                key={option.key}
              >
                {option.label}
              </div>
            );
          })}
      </div>
      <button className="btn text-center block mx-auto" onClick={onSubmit}>
        {i18n("confirm")}
      </button>
    </div>
  );
}

export function ObjectChoosePopup<T>({options, multiple, onChoose, onClose}: ObjectChooseUIParam<T> & PopupParam) {
  return (
    <Popup title="选择目标" onClose={onClose} size="small">
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