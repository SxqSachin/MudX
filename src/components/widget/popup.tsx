import { ReactChild, } from "react";
import { VoidCallback } from "@/types";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5"

const BodyPortal = ({ children }: { children: ReactChild }) =>
  createPortal(children, document.body);

export type PopupParam = {
  title?: string;
  onClose?: VoidCallback;
  children?: ReactChild;
  size?: "small" | "auto" | "big";
}
export function Popup({title, onClose, children, size}: PopupParam) {
  if (!size) {
    size = 'auto';
  }

  let sizeClass = "w-2/4 h-2/4";
  let translateClass = "translate-x-1/2 translate-y-1/2";

  switch (size) {
    case 'small':
      sizeClass = "w-1/3 h-1/3";
      translateClass = "translate-x-full translate-y-full";
      break;
  }

  return (
    <BodyPortal>
      <div
        className={`fixed top-0 left-0 p-4 ${sizeClass} transform ${translateClass} border rounded-md bg-gray-300 shadow-lg`}
      >
        <div className="mb-2 pb-2 h-8">
          <div className="float-left opacity-60">{title ?? "信息"}</div>
          <div
            className="float-right cursor-pointer"
            onClick={() => onClose?.()}
          >
            <IoClose className="text-red-400 hover:text-red-600 transition-colors duration-300 text-xl"></IoClose>
          </div>
          <div className="clear-both"></div>
        </div>
        <div
          className="w-full relative"
          style={{ height: "calc(100% - 2.5rem)" }}
        >
          {children}
        </div>
      </div>
    </BodyPortal>
  );
}