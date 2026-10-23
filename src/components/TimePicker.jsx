import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useStyles, useTheme } from '../context/ThemeContext';
import { fonts, radius } from '../theme';

const PRESETS = [
  { label: 'Morning', h: 8, m: 0 },
  { label: 'Lunch', h: 12, m: 30 },
  { label: 'Evening', h: 18, m: 0 },
  { label: 'Night', h: 21, m: 0 },
];

/** Dependency-free 12-hour time picker (works in Expo Go and dev builds, follows the app theme). */
export function TimePicker({ hour, minute, onChange }) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const isPM = hour >= 12;
  const h12 = hour % 12 === 0 ? 12 : hour % 12;

  const setH12 = (v, pm = isPM) => onChange((((v % 12) + 12) % 12) + (pm ? 12 : 0), minute);
  const bumpHour = (d) => setH12(h12 + d);
  const bumpMinute = (d) => onChange(hour, (((minute + d) % 60) + 60) % 60);

  const Col = ({ value, onUp, onDown }) => (
    <View style={s.col}>
      <Pressable onPress={onUp} hitSlop={8} style={s.arrow}><Feather name="chevron-up" size={22} color={colors.textSecondary} /></Pressable>
      <Text style={s.digits}>{value}</Text>
      <Pressable onPress={onDown} hitSlop={8} style={s.arrow}><Feather name="chevron-down" size={22} color={colors.textSecondary} /></Pressable>
    </View>
  );

  return (
    <View>
      <View style={s.display}>
        <Col value={String(h12)} onUp={() => bumpHour(1)} onDown={() => bumpHour(-1)} />
        <Text style={s.colon}>:</Text>
        <Col value={String(minute).padStart(2, '0')} onUp={() => bumpMinute(5)} onDown={() => bumpMinute(-5)} />
        <View style={s.period}>
          {['AM', 'PM'].map((p) => {
            const on = (p === 'PM') === isPM;
            return (
              <Pressable key={p} onPress={() => onChange((hour % 12) + (p === 'PM' ? 12 : 0), minute)} style={[s.periodBtn, on && { backgroundColor: colors.accentLight, borderColor: colors.accent }]}>
                <Text style={[s.periodText, on && { color: colors.accent }]}>{p}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={s.presets}>
        {PRESETS.map((p) => {
          const on = p.h === hour && p.m === minute;
          return (
            <Pressable key={p.label} onPress={() => onChange(p.h, p.m)} style={[s.chip, on && { backgroundColor: colors.accentLight, borderColor: colors.accent }]}>
              <Text style={[s.chipText, on && { color: colors.accent }]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    display: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    col: { alignItems: 'center', minWidth: 84 },
    arrow: { padding: 6 },
    digits: { fontFamily: fonts.display800, fontSize: 52, lineHeight: 58, letterSpacing: -2, color: colors.textPrimary, fontVariant: ['tabular-nums'] },
    colon: { fontFamily: fonts.display800, fontSize: 44, color: colors.textMuted, marginBottom: 6 },
    period: { gap: 8, marginLeft: 14 },
    periodBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
    periodText: { fontFamily: fonts.display700, fontSize: 13, color: colors.textSecondary },
    presets: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 20 },
    chip: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 5, borderRadius: radius.pill },
    chipText: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textSecondary },
  });
