import {useEffect, useState} from 'react';

// TODO: Remove this once its incorporated in rive-react
export default function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);

  useEffect(() => {
    const canListen = typeof window !== 'undefined' && 'matchMedia' in window;
    if (!canListen) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    function updatePrefersReducedMotion() {
      setPrefersReducedMotion(() => mediaQuery.matches);
    }
    mediaQuery.addEventListener('change', updatePrefersReducedMotion);
    updatePrefersReducedMotion();
    return () =>
      mediaQuery.removeEventListener('change', updatePrefersReducedMotion);
  }, []);

  return prefersReducedMotion;
}