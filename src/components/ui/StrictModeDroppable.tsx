import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "@hello-pangea/dnd";

/**
 * Wrapper for the `Droppable` component from `@hello-pangea/dnd` that fixes React StrictMode errors.
 * 
 * https://github.com/atlassian/@hello-pangea/dnd/issues/2399#issuecomment-1175638194
 */
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};