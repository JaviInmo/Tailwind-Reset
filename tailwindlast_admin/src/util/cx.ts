import classNames from "classnames";

export function cx(...args: Parameters<typeof classNames>) {
  return classNames(...args);
}
