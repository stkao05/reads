import { Store } from "@prisma/client";
import { HTMLProps, MouseEventHandler } from "react";

type InfoPopupProp = HTMLProps<HTMLAnchorElement> & {
  id: Store["id"];
  name: string;
  summary: string | null;
  img: {
    url: string;
    width: number;
    height: number;
  } | null;
  onClose?: MouseEventHandler<HTMLButtonElement>;
};

export function InfoPopup(props: InfoPopupProp) {
  return (
    <a href={`/s/${props.id}`} target="_blank" {...props}>
      {/* the button is optimized for improved click area on touch device */}
      <button
        data-close-btn
        className="absolute right-0 top-0 p-2"
        onClick={props.onClose}
      >
        <div className="rounded-full p-1 sm:p-[3px] bg-white opacity-70 hover:opacity-80 transition text-zinc-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </button>
      <div className="overflow-hidden sm:h-[150px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={props.id} // intentionally recreate an img elment, so that when switching store, prev img won't retend
          className="object-cover h-full sm:w-full"
          data-field="img"
          src={props.img?.url || ""}
          width={props.img?.width || 0}
          height={props.img?.height || 0}
          alt={props.name}
        />
      </div>
      <div className="p-2 text-zinc-800 overflow-hidden">
        <div data-field="name" className="font-semibold tracking-wider">
          {props.name}
        </div>
        <div
          data-field="subtitle"
          className="text-zinc-500 text-sm leading-6 tracking-wide line-clamp-4"
        >
          {props.summary}
        </div>
      </div>
    </a>
  );
}
