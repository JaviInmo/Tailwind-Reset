import { cx } from "@/util/cx";
import { ComponentPropsWithRef } from "react";
import { Button } from "react-bootstrap";
import styles from "./IconButton.module.css";

export function IconButton({
  children,
  className,
  ...props
}: ComponentPropsWithRef<"button">) {
  return (
    <Button
      {...props}
      variant={"outline-secondary"}
      className={cx(className, styles.icon_button)}
    >
      {children}
    </Button>
  );
}
