import { useState, useEffect, useRef } from "react";

export const useIntersectionTimer = (delay = 3000, threshold = 0.6) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    let timer;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setIsTriggered(true), delay);
        } else {
          clearTimeout(timer);
          setIsTriggered(false);
        }
      },
      { threshold }
    );

    if (elementRef.current) observer.observe(elementRef.current);

    return () => {
      clearTimeout(timer);
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [delay, threshold]);

  return [elementRef, isTriggered];
};