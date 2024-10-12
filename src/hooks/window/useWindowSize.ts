import { useEffect, useState } from "react";

type Size = {
    width: number;
    height: number;
};

/**
 * Return the current window size (width and height)
 * @example
 * const { width, height } = useWindowSize();
 */
export function useWindowSize(): Size {
    const [size, setSize] = useState<Size>({ height: 0, width: 0 });

    useEffect(() => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }, []);

    useEffect(() => {
        function onResize() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return size;
}
