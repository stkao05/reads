import { useEffect, useRef } from "react";

export function SaveIndicator(props: { saving: boolean }) {
  const { saving } = props;
  const first = useRef(true);

  useEffect(() => {
    first.current = false;
  });

  if (first.current) return null;

  return (
    <div className="fixed top-2 left-2 text-xs text-zinc-500">
      {saving ? (
        <div className="flex items-center">
          <div className="bg-yellow-400 rounded-full w-2 h-2 mr-2 "></div>
          儲存中
        </div>
      ) : (
        <div className="flex items-center animate-fade-out">
          <div className="bg-green-700 rounded-full w-2 h-2 mr-2 "></div>
          已更新
        </div>
      )}
    </div>
  );
}
