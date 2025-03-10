"use client";

import { HeartIcon } from "@/components/ui/heart-icon";
import { cn } from "@/lib/utils";
import { Store } from "@prisma/client";
import { useLocalStorage } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { HTMLProps } from "react";

export function FavoriteButton(
  props: HTMLProps<HTMLButtonElement> & { id: Store["id"] }
) {
  const { id } = props;
  let [favorites, setFavorites] = useLocalStorage<string[]>("favorites", []);

  const on = favorites.includes(id);
  const onClick = () => {
    if (on) {
      favorites = favorites.filter((x) => x !== id);
    } else {
      favorites = [...favorites, id];
    }
    setFavorites(favorites);
  };

  const variants = {
    init: { scale: 1 },
    tap: { scale: 1.2 },
  };

  return (
    <motion.button
      onClick={onClick}
      {...(props as any)}
      className={cn(
        props.className,
        "inline-flex items-center gap-1 transform transition-transform text-zinc-700 link-button"
      )}
      type="button"
      initial="init"
      whileTap="tap"
      variants={{ init: { scale: 1 }, tap: { scale: 1 } }}
    >
      <motion.span variants={variants}>
        <HeartIcon className={`w-5 h-5 transition`} filled={on} />
      </motion.span>
      <span className="text-zinc-800 text-sm">{on ? "已收藏" : "收藏"}</span>
    </motion.button>
  );
}
