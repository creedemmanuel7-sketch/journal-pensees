import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

/**
 * Rangée d'emojis d'humeur (MOODS).
 */
export default function MoodSelector({
  moods,
  selectedIndex,
  onSelect,
  theme,
  accent,
}) {
  return (
    <View style={styles.moodSelector}>
      {moods.map((m, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.moodBtn,
            { backgroundColor: theme.bg4 },
            selectedIndex === i && {
              backgroundColor: accent.light,
              borderWidth: 1.5,
              borderColor: accent.primary,
            },
          ]}
          onPress={() => {
            onSelect(i);
          }}
        >
          <Text style={{ fontSize: 18 }}>{m}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  moodSelector: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  moodBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
