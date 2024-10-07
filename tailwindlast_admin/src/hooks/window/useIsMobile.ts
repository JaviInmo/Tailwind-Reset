import { useEffect, useState } from "react";

import { Breakpoints } from "@/constants/breakpoints";

import { useWindowSize } from "./useWindowSize";

/**
 * Return if the current device is mobile or window width is less than tablet size.
 * @example
 * const isMobile = useIsMobile();
 */
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    const { width } = useWindowSize();

    useEffect(() => {
        setIsMobile(window.matchMedia("(pointer:coarse)").matches);
    }, []);

    return isMobile || width < Breakpoints.SM;
}
