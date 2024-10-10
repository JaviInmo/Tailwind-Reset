import { cx } from "@/util/cx";
import { ComponentPropsWithRef } from "react";

export function IconButton({
  children,
  className,
  ...props
}: ComponentPropsWithRef<"button">) {
  return (
    <button
      {...props}
      className={cx(
        "text-black bg-white rounded p-1 border-none h-min-content hover:bg-gray-300 hover:text-black",
        className
      )}
    >
      {children}
    </button>
  );
}
