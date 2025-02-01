import { useEffect, useState } from "react";

export const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  const handleResize = () => {
    const checkPoint = window.innerWidth < breakpoint;
    setIsMobile(checkPoint);
  };

  // On component mount, handleResize() runs to update the state. window.addEventListener listens for screen size changes. On cleanup, it removes the event listener.
  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return [isMobile];
};
