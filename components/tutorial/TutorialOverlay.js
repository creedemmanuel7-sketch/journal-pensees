import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Modal,
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTutorial } from '../../context/TutorialContext';
import { useTheme } from '../../context/ThemeContext';

const SPOT_PADDING = 8;
const SPOT_RADIUS = 16;
const BUBBLE_MARGIN = 16;
const DIM_COLOR = 'rgba(0,0,0,0.78)';

// Sous-chemin d'un rectangle arrondi (sens horaire) pour la découpe even-odd.
function roundedRectPath(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  return (
    `M${x + rr},${y} ` +
    `h${w - 2 * rr} a${rr},${rr} 0 0 1 ${rr},${rr} ` +
    `v${h - 2 * rr} a${rr},${rr} 0 0 1 ${-rr},${rr} ` +
    `h${-(w - 2 * rr)} a${rr},${rr} 0 0 1 ${-rr},${-rr} ` +
    `v${-(h - 2 * rr)} a${rr},${rr} 0 0 1 ${rr},${-rr} z`
  );
}

export default function TutorialOverlay() {
  const tutorial = useTutorial();
  const themeCtx = useTheme();
  const { width: W, height: H } = useWindowDimensions();

  const [spot, setSpot] = useState(null);
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  const visible = !!tutorial?.visible;
  const steps = tutorial?.steps || [];
  const index = tutorial?.index || 0;
  const step = steps[index] || null;

  // Mesure la cible de l'étape courante (avec quelques tentatives, le layout
  // pouvant ne pas être stabilisé juste après une transition d'écran).
  useEffect(() => {
    if (!visible || !step) {
      setSpot(null);
      return undefined;
    }
    let cancelled = false;
    let attempts = 0;

    const tryMeasure = () => {
      if (cancelled) return;
      const node = step.targetId
        ? tutorial.targetsRef.current[step.targetId]
        : null;
      if (node && typeof node.measureInWindow === 'function') {
        node.measureInWindow((x, y, w, h) => {
          if (cancelled) return;
          if (w > 0 && h > 0) {
            setSpot({ x, y, w, h });
          } else if (attempts < 5) {
            attempts += 1;
            setTimeout(tryMeasure, 120);
          } else {
            setSpot(null);
          }
        });
      } else if (attempts < 5) {
        attempts += 1;
        setTimeout(tryMeasure, 120);
      } else {
        setSpot(null);
      }
    };

    setSpot(null);
    tryMeasure();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, index, step?.targetId]);

  useEffect(() => {
    if (visible) {
      fade.setValue(0);
      scale.setValue(0.96);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, index, fade, scale]);

  if (!visible || !step || !themeCtx) return null;

  const { theme, accent } = themeCtx;
  const isLast = index === steps.length - 1;
  const isFirst = index === 0;

  // Cadre du spotlight (avec marge) borné à l'écran.
  let frame = null;
  if (spot) {
    const fx = Math.max(0, spot.x - SPOT_PADDING);
    const fy = Math.max(0, spot.y - SPOT_PADDING);
    const fw = Math.min(W - fx, spot.w + SPOT_PADDING * 2);
    const fh = Math.min(H - fy, spot.h + SPOT_PADDING * 2);
    frame = { x: fx, y: fy, w: fw, h: fh, cx: fx + fw / 2, cy: fy + fh / 2 };
  }

  // Position de la bulle : sous la cible si elle est dans la moitié haute,
  // au-dessus sinon. Centrée verticalement en l'absence de cible.
  const bubbleStyle = { left: BUBBLE_MARGIN, right: BUBBLE_MARGIN };
  if (!frame) {
    bubbleStyle.top = H * 0.32;
  } else if (frame.cy < H / 2) {
    bubbleStyle.top = Math.min(frame.y + frame.h + 14, H - 220);
  } else {
    bubbleStyle.bottom = Math.min(H - frame.y + 14, H - 120);
  }

  const dimPath =
    `M0,0 H${W} V${H} H0 Z` +
    (frame
      ? ' ' + roundedRectPath(frame.x, frame.y, frame.w, frame.h, SPOT_RADIUS)
      : '');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={tutorial.skip}
    >
      <Animated.View style={[styles.root, { opacity: fade }]}>
        {/* Voile sombre avec découpe spotlight (true cutout via even-odd) */}
        <Svg
          width={W}
          height={H}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Path d={dimPath} fill={DIM_COLOR} fillRule="evenodd" />
        </Svg>

        {/* Couche de capture des touches (le voile ne fait rien au tap) */}
        <Pressable style={StyleSheet.absoluteFill} onPress={() => {}} />

        {/* Cadre accent autour de la cible + zone tappable pour avancer */}
        {frame && (
          <Pressable
            onPress={tutorial.next}
            style={[
              styles.frame,
              {
                left: frame.x,
                top: frame.y,
                width: frame.w,
                height: frame.h,
                borderColor: accent.primary,
              },
            ]}
          />
        )}

        {/* Bulle d'explication */}
        <Animated.View
          style={[
            styles.bubble,
            bubbleStyle,
            {
              backgroundColor: theme.bg3,
              borderColor: theme.border,
              opacity: fade,
              transform: [{ scale }],
            },
          ]}
        >
          <View style={styles.bubbleHeader}>
            <View style={styles.dots}>
              {steps.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        i === index ? accent.primary : theme.border,
                      width: i === index ? 18 : 6,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.counter, { color: theme.text3 }]}>
              {index + 1}/{steps.length}
            </Text>
          </View>

          {!!step.title && (
            <Text style={[styles.title, { color: accent.primary }]}>
              {step.title}
            </Text>
          )}
          {!!step.description && (
            <Text style={[styles.desc, { color: theme.text2 }]}>
              {step.description}
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={tutorial.skip}
              style={styles.skipBtn}
              accessibilityRole="button"
              accessibilityLabel="Passer le tutoriel"
            >
              <Text style={[styles.skipText, { color: theme.text3 }]}>
                Passer
              </Text>
            </TouchableOpacity>

            <View style={styles.navBtns}>
              {!isFirst && (
                <TouchableOpacity
                  onPress={tutorial.prev}
                  style={[styles.prevBtn, { borderColor: theme.border }]}
                  accessibilityRole="button"
                  accessibilityLabel="Étape précédente"
                >
                  <Text style={[styles.prevText, { color: theme.text2 }]}>
                    Précédent
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={tutorial.next}
                style={[styles.nextBtn, { backgroundColor: accent.primary }]}
                accessibilityRole="button"
                accessibilityLabel={isLast ? 'Terminer' : 'Suivant'}
              >
                <Text style={[styles.nextText, { color: theme.bg }]}>
                  {isLast ? 'Terminer' : 'Suivant'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  frame: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: SPOT_RADIUS,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { height: 6, borderRadius: 3 },
  counter: { fontSize: 11, letterSpacing: 1 },
  title: { fontSize: 17, fontWeight: '600', marginBottom: 6 },
  desc: { fontSize: 14, lineHeight: 21, marginBottom: 18 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipBtn: { paddingVertical: 8, paddingRight: 8 },
  skipText: { fontSize: 13 },
  navBtns: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  prevBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  prevText: { fontSize: 13, fontWeight: '500' },
  nextBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  nextText: { fontSize: 13, fontWeight: '600' },
});
