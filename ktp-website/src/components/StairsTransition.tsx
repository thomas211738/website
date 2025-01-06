import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

export default function StairsTransition({
  children,
  routeKey,
}: {
  children: ReactNode;
  routeKey: string;
}) {
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    // Delay showing the children until the animation completes
    const timeout = setTimeout(() => {
      setShowChildren(true);
    }, 800); // Matches animation duration

    return () => {
      clearTimeout(timeout);
      setShowChildren(false); // Reset when route changes
    };
  }, [routeKey]);

  const expand = {
    initial: { top: "0%" }, // Start above the screen
    enter: (custom: number) => ({
      top: "-100%", // Animate into place
      transition: {
        duration: 0.4,
        delay: 0.05 * custom, // Add stagger effect
      },
    }),
    exit: (custom: number) => ({
      top: "0%", // Exit downward
      transition: {
        duration: 0.4,
        delay: 0.05 * custom, // Add stagger effect
      },
    }),
  };

  const numofcolumns = 8;

  return (
    <div className="page stairs">
      <AnimatePresence mode="wait"> {/* Wrap this around the transition */}
        <div
          className="transition-container h-screen w-screen fixed top-0 left-0 pointer-events-none z-[100] flex"
          key={routeKey}
        >
          {[...Array(numofcolumns)].map((_, i) => (
            <motion.div
              key={i}
              className="h-full w-full bg-black relative"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={expand}
              custom={numofcolumns - i}
            />
          ))}
        </div>
      </AnimatePresence>
      {/* Show children only after animation completes */}
      {showChildren && children}
    </div>
  );
}
