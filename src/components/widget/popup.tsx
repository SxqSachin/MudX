import { ReactChild, } from "react";
import { VoidCallback } from "@/types";

export type PopupParam = {
  title?: string;
  onClose?: VoidCallback;
  children?: ReactChild;
}
export function Popup({title, onClose, children}: PopupParam) {
  return (
    <div className="fixed w-2/4 h-2/4 top-0 left-0 transform translate-x-1/2 translate-y-1/2
                    p-4
                    border rounded-md
                    bg-gray-300 shadow-lg">

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