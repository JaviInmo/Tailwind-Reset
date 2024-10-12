import { useCallback, useEffect, useState } from "react";

import { Breakpoints } from "@/constants/breakpoints";

export const useMediaQuery = (
    breakpoint: keyof typeof Breakpoints,
    type: "min" | "max" = "min",
) => {
    const getMediaQuery = useCallback(() => {
        const width = type === "max" ? Breakpoints[breakpoint] - 1 : breakpoint;
        return window.matchMedia(`(${type}-width: ${width}px)`);
    }, [breakpoint, type]);

    const [match, setMatch] = useState<boolean>(false);

    useEffect(() => {
        const mediaQuery = getMediaQuery();
        setMatch(mediaQuery.matches);
    }, [getMediaQuery]);

    useEffect(() => {
        const mediaQuery = getMediaQuery();

        const onMediaQueryChange = (query: MediaQueryListEvent) => setMatch(query.matches);

        mediaQuery.addEventListener("change", onMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener("change", onMediaQueryChange);
        };
    }, [breakpoint, getMediaQuery, type]);

    return match;
};
