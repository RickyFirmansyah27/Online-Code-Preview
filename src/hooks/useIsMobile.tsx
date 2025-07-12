import { useEffect, useState } from "react";

export const useIsMobile = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Pastikan ini hanya jalan di client
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);

    // Tambahkan event listener
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return isMobile;
};
