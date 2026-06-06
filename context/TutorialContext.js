import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TutorialOverlay from '../components/tutorial/TutorialOverlay';

const TutorialContext = createContext();

const SEEN_PREFIX = 'tutorial_seen_';
const seenKey = (screenKey) => `${SEEN_PREFIX}${screenKey}`;

export function TutorialProvider({ children }) {
  // Cache mémoire des écrans déjà vus (clé -> true). Hydraté au montage.
  const [seen, setSeen] = useState({});
  const [seenReady, setSeenReady] = useState(false);

  // État du tutoriel courant
  const [activeKey, setActiveKey] = useState(null);
  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // Registre des cibles mesurables : id -> node natif (avec measureInWindow)
  const targetsRef = useRef({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const tutoKeys = keys.filter((k) => k.startsWith(SEEN_PREFIX));
        const pairs = await AsyncStorage.multiGet(tutoKeys);
        if (!mounted) return;
        const map = {};
        pairs.forEach(([k, v]) => {
          if (v === '1') map[k.slice(SEEN_PREFIX.length)] = true;
        });
        setSeen(map);
      } catch (e) {
        // En cas d'échec on considère qu'aucun tuto n'a été vu (comportement sûr).
      } finally {
        if (mounted) setSeenReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const hasSeen = useCallback((screenKey) => !!seen[screenKey], [seen]);

  const markSeen = useCallback(async (screenKey) => {
    if (!screenKey) return;
    setSeen((prev) => ({ ...prev, [screenKey]: true }));
    try {
      await AsyncStorage.setItem(seenKey(screenKey), '1');
    } catch (e) {}
  }, []);

  const resetAllTutorials = useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const tutoKeys = keys.filter((k) => k.startsWith(SEEN_PREFIX));
      if (tutoKeys.length > 0) await AsyncStorage.multiRemove(tutoKeys);
    } catch (e) {}
    setSeen({});
  }, []);

  const registerTarget = useCallback((id, node) => {
    if (!id) return;
    if (node) targetsRef.current[id] = node;
    else delete targetsRef.current[id];
  }, []);

  const startTutorial = useCallback((screenKey, nextSteps) => {
    if (!Array.isArray(nextSteps) || nextSteps.length === 0) return;
    setActiveKey(screenKey);
    setSteps(nextSteps);
    setIndex(0);
    setVisible(true);
  }, []);

  const finishTutorial = useCallback(() => {
    setVisible(false);
    if (activeKey) markSeen(activeKey);
    setActiveKey(null);
    setSteps([]);
    setIndex(0);
  }, [activeKey, markSeen]);

  // Annule l'affichage sans marquer comme vu (ex : navigation pendant le délai).
  const cancelTutorial = useCallback(() => {
    setVisible(false);
    setActiveKey(null);
    setSteps([]);
    setIndex(0);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => {
      if (i >= steps.length - 1) {
        finishTutorial();
        return i;
      }
      return i + 1;
    });
  }, [steps.length, finishTutorial]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const skip = useCallback(() => {
    finishTutorial();
  }, [finishTutorial]);

  const value = {
    seenReady,
    hasSeen,
    markSeen,
    resetAllTutorials,
    registerTarget,
    startTutorial,
    cancelTutorial,
    // Données de rendu pour l'overlay
    targetsRef,
    activeKey,
    steps,
    index,
    visible,
    next,
    prev,
    skip,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
      <TutorialOverlay />
    </TutorialContext.Provider>
  );
}

export const useTutorial = () => useContext(TutorialContext);

/**
 * Callback-ref à attacher à un élément pour l'exposer comme cible mesurable.
 * Usage : const fabRef = useTutorialRef('fab'); <View ref={fabRef} />
 */
export function useTutorialRef(id) {
  const ctx = useContext(TutorialContext);
  return useCallback(
    (node) => {
      ctx?.registerTarget(id, node);
    },
    [ctx, id],
  );
}

/**
 * Hook principal des écrans.
 * Au montage (si l'écran n'a jamais été vu, hors mode leurre / non authentifié),
 * lance automatiquement le tutoriel après un court délai laissant le layout se mesurer.
 *
 * @param {string} screenKey  clé stable de l'écran (ex: 'journal')
 * @param {Array}  steps      étapes du tutoriel
 * @param {object} options    { enabled?: boolean, delay?: number }
 * @returns {{ start: () => void, hasSeen: boolean }}
 */
export function useScreenTutorial(screenKey, steps, options = {}) {
  const { enabled = true, delay = 650 } = options;
  const ctx = useContext(TutorialContext);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  useEffect(() => {
    if (!ctx || !ctx.seenReady) return undefined;
    if (!enabled) return undefined;
    if (ctx.hasSeen(screenKey)) return undefined;

    const timer = setTimeout(() => {
      ctx.startTutorial(screenKey, stepsRef.current);
    }, delay);

    return () => {
      clearTimeout(timer);
      // Si l'on quitte l'écran alors que SON tuto est encore affiché, on l'annule.
      if (ctx.activeKey === screenKey && ctx.visible) {
        ctx.cancelTutorial();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.seenReady, enabled, screenKey]);

  const start = useCallback(() => {
    ctx?.startTutorial(screenKey, stepsRef.current);
  }, [ctx, screenKey]);

  return { start, hasSeen: ctx ? ctx.hasSeen(screenKey) : false };
}
