import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options = { threshold: 0.1, rootMargin: "0px" }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const currentElement = elementRef.current; // Yerel değişkene ata — StrictMode cleanup güvenliği

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (currentElement) {
          observer.unobserve(currentElement);
        }
      }
    }, options);

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return [elementRef, isIntersecting];
};
