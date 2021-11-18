import { ReactChild, } from "react";
import { VoidCallback } from "@/types";

export type PopupParam = {
  title?: string;
  onClose?: VoidCallback;
  children?: ReactChild;
  size?: "auto" | "big";
}
export function Popup({title, onClose, children, size}: PopupParam) {
  if (!size) {
    size = 'auto';
  }

  let width = '50%';
  let height = '50%';
  let translate = 'translate-x-1/2 translate-y-1/2';

  switch (size) {
    case 'big':
      width = '50vw';
      height = '50vh';
      translate = '';
      break;
  }

  return (
    <div className={`fixed top-0 left-0 p-4
                    transform ${translate}
                    border rounded-md
                    bg-gray-300 shadow-lg`} style={{ width, height }}>

      <div className="mb-2 pb-2 h-8">
        <div className="float-left opacity-60">{title ?? '信息'}</div>
        <div className="float-right cursor-pointer" onClick={() => onClose?.()}>X</div>
        <div className="clear-both"></div>
      </div>
      <div className="w-full relative" style={{height: "calc(100% - 2.5rem)"}}>
        { children }
      </div>
    </div>
  )
}