import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAppFonts, FONT_DISPLAY_ITALIC } from '../utils/fonts';
import {
  LEGAL_UPDATED,
  PRIVACY_SECTIONS,
  TERMS_SECTIONS,
} from '../content/legalContent';

export default function LegalScreen({ navigation, route }) {
  const { theme, accent } = useTheme();
  const { fontsLoaded } = useAppFonts();
  const doc = route?.params?.doc === 'terms' ? 'terms' : 'privacy';
  const title =
    doc === 'terms' ? 'Conditions d’utilisation' : 'Confidentialité';
  const sections = doc === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View
        style={[
          styles.top,
          { borderBottomColor: theme.border, backgroundColor: theme.bg2 },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={[styles.back, { color: accent.primary }]}>← Retour</Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.title,
            { color: theme.text },
            fontsLoaded && { fontFamily: FONT_DISPLAY_ITALIC },
          ]}
        >
          {title}
        </Text>
        <Text style={[styles.meta, { color: theme.text3 }]}>
          Mise à jour : {LEGAL_UPDATED}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        {sections.map((section) => (
          <View key={section.title} style={styles.block}>
            <Text style={[styles.h, { color: theme.text }]}>{section.title}</Text>
            <Text style={[styles.p, { color: theme.text2 }]}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  top: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, borderBottomWidth: 1 },
  back: { fontSize: 15, marginBottom: 10 },
  title: { fontSize: 28, fontStyle: 'italic', fontWeight: '300' },
  meta: { marginTop: 6, fontSize: 12 },
  body: { padding: 20, paddingBottom: 48 },
  block: { marginBottom: 22 },
  h: { fontSize: 17, fontWeight: '600', marginBottom: 8 },
  p: { fontSize: 15, lineHeight: 22 },
});
