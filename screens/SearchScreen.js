import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useAppFonts, FONT_DISPLAY_ITALIC } from '../utils/fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import { useScreenTutorial, useTutorialRef } from '../context/TutorialContext';

const MOOD_DOTS = {
  '😌': '#3ecf8e',
  '✨': '#f0c040',
  '🦅': '#f09040',
  '🕯️': '#f0a090',
  '🌊': '#4080f0',
};

const MOODS = ['😌', '✨', '🦅', '🕯️', '🌊'];
const DATE_FILTERS = [
  { id: 'all', label: 'Toutes dates' },
  { id: 'today', label: "Aujourd'hui" },
  { id: 'week', label: '7 jours' },
  { id: 'month', label: '30 jours' },
];

function noteMatchesDate(note, filterId) {
  if (filterId === 'all') return true;
  const d = new Date(note.date);
  const now = new Date();
  if (filterId === 'today') return d.toDateString() === now.toDateString();
  const diff = now - d;
  if (filterId === 'week') return diff <= 7 * 24 * 60 * 60 * 1000;
  if (filterId === 'month') return diff <= 30 * 24 * 60 * 60 * 1000;
  return true;
}

export default function SearchScreen({ navigation }) {
  const { theme, accent } = useTheme();
  const { getVisibleNotes, formatDate, formatTime } = useNotes();
  const { fontsLoaded } = useAppFonts();
  const { isDecoyMode } = useAuth();

  // Tutoriel contextuel de la recherche
  const searchBarTargetRef = useTutorialRef('search-bar');
  const filtersTargetRef = useTutorialRef('search-filters');
  const locationTargetRef = useTutorialRef('search-location');
  const TUTORIAL_STEPS = [
    {
      targetId: 'search-bar',
      title: 'Rechercher',
      description:
        'Tapez un mot-clé : la recherche explore le titre, le contenu et le lieu de vos pensées.',
    },
    {
      targetId: 'search-filters',
      title: 'Filtres multi-critères',
      description:
        'Combinez une période (aujourd’hui, 7 jours, 30 jours) et une humeur pour affiner.',
    },
    {
      targetId: 'search-location',
      title: 'Filtrer par lieu',
      description: 'Retrouvez les pensées écrites dans une ville ou un pays.',
    },
  ];
  useScreenTutorial('search', TUTORIAL_STEPS, { enabled: !isDecoyMode });

  const [query, setQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const allNotes = getVisibleNotes();

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (moodFilter) n += 1;
    if (dateFilter !== 'all') n += 1;
    if (locationFilter.trim()) n += 1;
    return n;
  }, [moodFilter, dateFilter, locationFilter]);

  useEffect(() => {
    const hasQuery = query.trim().length > 0;
    const hasFilters =
      moodFilter || dateFilter !== 'all' || locationFilter.trim().length > 0;

    if (!hasQuery && !hasFilters) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const q = query.toLowerCase().trim();
    const loc = locationFilter.toLowerCase().trim();

    const found = allNotes.filter((note) => {
      if (moodFilter && note.mood !== moodFilter) return false;
      if (!noteMatchesDate(note, dateFilter)) return false;
      if (loc && !note.location?.toLowerCase().includes(loc)) return false;
      if (!q) return true;
      return (
        note.titre?.toLowerCase().includes(q) ||
        note.contenu?.toLowerCase().includes(q) ||
        note.location?.toLowerCase().includes(q)
      );
    });

    setResults(found);
    setHasSearched(true);
  }, [query, moodFilter, dateFilter, locationFilter, allNotes]);

  const highlight = (text, searchQuery) => {
    if (!searchQuery.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <Text
          key={i}
          style={{
            backgroundColor: accent.primary + '40',
            color: accent.primary,
          }}
        >
          {part}
        </Text>
      ) : (
        part
      ),
    );
  };

  const getExcerpt = (contenu, searchQuery) => {
    if (!contenu) return '';
    if (!searchQuery.trim()) return contenu.slice(0, 100) + '...';
    const idx = contenu.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx === -1) return contenu.slice(0, 100) + '...';
    const start = Math.max(0, idx - 40);
    const end = Math.min(contenu.length, idx + 80);
    return (
      (start > 0 ? '...' : '') +
      contenu.slice(start, end) +
      (end < contenu.length ? '...' : '')
    );
  };

  const clearFilters = () => {
    setMoodFilter(null);
    setDateFilter('all');
    setLocationFilter('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg2 }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={[styles.backText, { color: theme.text2 }]}>
            ← Retour
          </Text>
        </TouchableOpacity>
        <Text
          style={
            fontsLoaded
              ? {
                  fontFamily: FONT_DISPLAY_ITALIC,
                  fontSize: 20,
                  color: accent.primary,
                  fontStyle: 'italic',
                }
              : { fontSize: 20, color: accent.primary, fontStyle: 'italic' }
          }
        >
          Recherche
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <View
        ref={searchBarTargetRef}
        collapsable={false}
        style={[
          styles.searchBar,
          { backgroundColor: theme.bg3, borderColor: theme.border },
        ]}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Chercher dans vos pensées..."
          placeholderTextColor={theme.text3}
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={[styles.clearBtn, { color: theme.text3 }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View ref={filtersTargetRef} collapsable={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterRow}
        >
          {DATE_FILTERS.map((df) => (
            <TouchableOpacity
              key={df.id}
              style={[
                styles.filterChip,
                { borderColor: theme.border, backgroundColor: theme.bg3 },
                dateFilter === df.id && {
                  borderColor: accent.primary,
                  backgroundColor: accent.light,
                },
              ]}
              onPress={() => setDateFilter(df.id)}
            >
              <Text
                style={{
                  color: dateFilter === df.id ? accent.primary : theme.text2,
                  fontSize: 12,
                }}
              >
                {df.label}
              </Text>
            </TouchableOpacity>
          ))}
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.filterChip,
                { borderColor: theme.border, backgroundColor: theme.bg3 },
                moodFilter === m && {
                  borderColor: accent.primary,
                  backgroundColor: accent.light,
                },
              ]}
              onPress={() => setMoodFilter(moodFilter === m ? null : m)}
            >
              <Text style={{ fontSize: 16 }}>{m}</Text>
            </TouchableOpacity>
          ))}
          {activeFilterCount > 0 && (
            <TouchableOpacity
              style={[styles.filterChip, { borderColor: '#e55' }]}
              onPress={clearFilters}
            >
              <Text style={{ color: '#e55', fontSize: 12 }}>
                Effacer filtres
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <View
        ref={locationTargetRef}
        collapsable={false}
        style={[
          styles.locationBar,
          { backgroundColor: theme.bg3, borderColor: theme.border },
        ]}
      >
        <Text style={{ fontSize: 14 }}>📍</Text>
        <TextInput
          style={[styles.locationInput, { color: theme.text }]}
          placeholder="Filtrer par ville ou pays..."
          placeholderTextColor={theme.text4}
          value={locationFilter}
          onChangeText={setLocationFilter}
        />
      </View>

      <ScrollView
        style={styles.results}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {hasSearched && (
          <Text style={[styles.resultCount, { color: theme.text3 }]}>
            {results.length === 0
              ? 'Aucun résultat'
              : `${results.length} pensée${results.length > 1 ? 's' : ''} trouvée${results.length > 1 ? 's' : ''}`}
          </Text>
        )}

        {!hasSearched && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text
              style={[
                styles.emptyTitle,
                { color: accent.primary },
                fontsLoaded && {
                  fontFamily: FONT_DISPLAY_ITALIC,
                  fontStyle: 'italic',
                },
              ]}
            >
              Cherchez dans vos pensées
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.text3 }]}>
              Texte libre, humeur, date ou lieu — combinez les filtres
            </Text>
            <View style={styles.suggestionsWrap}>
              <Text style={[styles.suggestionsLabel, { color: theme.text3 }]}>
                SUGGESTIONS
              </Text>
              <View style={styles.suggestions}>
                {['amour', 'bonheur', 'travail', 'rêve', 'famille'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.suggestionChip,
                      { backgroundColor: theme.bg3, borderColor: theme.border },
                    ]}
                    onPress={() => setQuery(s)}
                  >
                    <Text
                      style={[styles.suggestionText, { color: theme.text2 }]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {hasSearched && results.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💭</Text>
            <Text
              style={[
                styles.emptyTitle,
                { color: accent.primary },
                fontsLoaded && {
                  fontFamily: FONT_DISPLAY_ITALIC,
                  fontStyle: 'italic',
                },
              ]}
            >
              Aucune pensée trouvée
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.text3 }]}>
              Essayez avec d'autres mots-clés ou filtres
            </Text>
          </View>
        )}

        {results.map((note) => (
          <TouchableOpacity
            key={note.id}
            style={[
              styles.resultCard,
              { backgroundColor: theme.bg3, borderColor: theme.border },
            ]}
            onPress={() => navigation.navigate('Editor', { noteId: note.id })}
          >
            <View style={styles.resultHeader}>
              <View
                style={[
                  styles.moodDot,
                  { backgroundColor: MOOD_DOTS[note.mood] || accent.primary },
                ]}
              />
              <Text
                style={[
                  styles.resultTitle,
                  { color: accent.primary },
                  fontsLoaded && {
                    fontFamily: FONT_DISPLAY_ITALIC,
                    fontStyle: 'italic',
                  },
                ]}
                numberOfLines={1}
              >
                {highlight(note.titre, query)}
              </Text>
              <Text style={[styles.resultDate, { color: theme.text3 }]}>
                {formatTime(note.date)}
              </Text>
            </View>
            <Text style={[styles.resultMeta, { color: theme.text3 }]}>
              {formatDate(note.date)}
              {note.location ? ` · 📍 ${note.location}` : ''}
            </Text>
            <Text
              style={[styles.resultExcerpt, { color: theme.text2 }]}
              numberOfLines={3}
            >
              {highlight(getExcerpt(note.contenu, query), query)}
            </Text>
            {note.pinned && (
              <Text style={[styles.pinnedBadge, { color: accent.primary }]}>
                📌 Épinglée
              </Text>
            )}
          </TouchableOpacity>
        ))}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 60 },
  backText: { fontSize: 14 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 16, padding: 0 },
  clearBtn: { fontSize: 14, padding: 4 },
  filterScroll: { maxHeight: 44, marginBottom: 8 },
  filterRow: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  locationInput: { flex: 1, fontSize: 14, padding: 0 },
  results: { flex: 1, paddingHorizontal: 20 },
  resultCount: { fontSize: 11, letterSpacing: 1.5, marginBottom: 16 },
  emptyState: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 22, textAlign: 'center', marginBottom: 10 },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  suggestionsWrap: { width: '100%' },
  suggestionsLabel: {
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: 'center',
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  suggestionText: { fontSize: 13 },
  resultCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  moodDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  resultTitle: { flex: 1, fontSize: 18 },
  resultDate: { fontSize: 11 },
  resultMeta: { fontSize: 9, letterSpacing: 1.5, marginBottom: 8 },
  resultExcerpt: { fontSize: 13, lineHeight: 20 },
  pinnedBadge: { fontSize: 10, letterSpacing: 1, marginTop: 8 },
});
