import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const { threshold = 0.1, rootMargin = "0px" } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const currentElement = elementRef.current;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (currentElement) {
          observer.unobserve(currentElement);
        }
      }
    }, { threshold, rootMargin });

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin]);

  return [elementRef, isIntersecting];
};
