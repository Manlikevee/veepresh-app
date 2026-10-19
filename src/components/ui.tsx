import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Animated, Easing, Pressable, ScrollView, StyleProp, StyleSheet, Text, TextInput,
  TextInputProps, View, ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MAX_CONTENT_WIDTH, colors, fonts, radius, shadow } from '../theme';

export type IconName = React.ComponentProps<typeof Feather>['name'];

/* ── Page shell: bg, 16px padding, 760px max width (body + .quiz-header max-width) ── */
export function Page({
  children, scroll = true, contentStyle,
}: { children: React.ReactNode; scroll?: boolean; contentStyle?: StyleProp<ViewStyle> }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, paddingBottom: 64, alignItems: 'center' }}
        >
          <View style={[{ width: '100%', maxWidth: MAX_CONTENT_WIDTH }, contentStyle]}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, padding: 16, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' }, contentStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

/* ── @keyframes fadeUp ── */
export function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 500, delay, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [v, delay]);
  return (
    <Animated.View style={[{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }, style]}>
      {children}
    </Animated.View>
  );
}

/* ── .brand-mark + .brand-name + .brand-badge ── */
export function Brand({ badge = 'Quiz' }: { badge?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={s.brandMark}>
        <Feather name="book-open" size={18} color="#fff" />
      </View>
      <Text style={s.brandName}>Veepresh</Text>
      <View style={s.brandBadge}>
        <Text style={s.brandBadgeText}>{badge}</Text>
      </View>
    </View>
  );
}

/* ── .btn-primary / .btn-secondary / .skip-btn ── */
type BtnProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'link';
  size?: 'md' | 'lg';
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, variant = 'primary', size = 'md', icon, iconRight, loading, disabled, style }: BtnProps) {
  const off = disabled || loading;
  const lg = size === 'lg';
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => [
        s.btn,
        { paddingVertical: lg ? 14 : 10 },
        variant === 'primary' && { backgroundColor: off ? colors.textMuted : pressed ? colors.accentDark : colors.accent, paddingHorizontal: 22 },
        variant === 'secondary' && { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: pressed ? colors.accent : colors.border, paddingHorizontal: 20 },
        variant === 'link' && { paddingHorizontal: 0, paddingVertical: 4 },
        style,
      ]}
    >
      {({ pressed }) => {
        const fg = variant === 'primary' ? '#fff' : variant === 'link' ? colors.textMuted : pressed ? colors.accent : colors.textPrimary;
        return loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            {icon && <Feather name={icon} size={15} color={fg} />}
            <Text
              style={[
                s.btnText,
                { color: fg },
                variant === 'primary' && { letterSpacing: -0.1 },
                variant === 'link' && { fontSize: 13, textDecorationLine: 'underline' },
              ]}
            >
              {title}
            </Text>
            {iconRight && <Feather name={iconRight} size={15} color={fg} />}
          </>
        );
      }}
    </Pressable>
  );
}

/* ── .answer-input ── */
export function Field({ label, error, secure, ...rest }: TextInputProps & { label: string; error?: string; secure?: boolean }) {
  const [hidden, setHidden] = useState(!!secure);
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={[s.inputWrap, focused && { borderColor: colors.accent }, !!error && { borderColor: colors.error }]}>
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={colors.textMuted}
          style={s.input}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Feather name={hidden ? 'eye' : 'eye-off'} size={17} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={s.fieldError}>{error}</Text>}
    </View>
  );
}

/* ── generic card: surface + border + radius 12 + shadow ── */
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

/* ── .stat-item row (.quiz-stats) ── */
export type StatItem = { icon: IconName; pre?: string; strong: string; post?: string };

export function StatRow({ items, bordered = true }: { items: StatItem[]; bordered?: boolean }) {
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }, bordered && { paddingTop: 18, borderTopWidth: 1, borderTopColor: colors.border }]}>
      {items.map((it) => (
        <View key={it.strong} style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Feather name={it.icon} size={15} color={colors.textMuted} />
          <Text style={s.statText}>
            {it.pre}
            <Text style={s.statStrong}>{it.strong}</Text>
            {it.post}
          </Text>
        </View>
      ))}
    </View>
  );
}

/* ── .quiz-meta header card ── */
export function MetaCard({
  category, title, description, stats, onPress, descriptionLines, right,
}: {
  category: string; title: string; description: string; stats: StatItem[];
  onPress?: () => void; descriptionLines?: number; right?: React.ReactNode;
}) {
  const body = (
    <View style={s.meta}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <Text style={[s.category, { flex: 1 }]}>{category}</Text>
        {right}
      </View>
      <Text style={s.quizTitle}>{title}</Text>
      <Text style={s.quizDescription} numberOfLines={descriptionLines}>{description}</Text>
      <StatRow items={stats} />
    </View>
  );
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.92 }}>{body}</Pressable> : body;
}

/* ── .progress-track / .progress-fill (animated width, 0.4s) ── */
export function ProgressBar({ pct }: { pct: number }) {
  const v = useRef(new Animated.Value(pct)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: pct, duration: 400, easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: false }).start();
  }, [pct, v]);
  return (
    <View style={s.track}>
      <Animated.View style={[s.fill, { width: v.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
    </View>
  );
}

/* ── back row for sub pages ── */
export function BackRow({ onBack, right }: { onBack: () => void; right?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <Button title="Back" variant="secondary" icon="chevron-left" onPress={onBack} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />
      {right}
    </View>
  );
}

export const text = StyleSheet.create({
  h1: { fontFamily: fonts.display700, fontSize: 26, lineHeight: 31, letterSpacing: -0.5, color: colors.textPrimary },
  lead: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 23, color: colors.textSecondary },
  muted: { fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary },
  link: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.accent },
  sectionTitle: { fontFamily: fonts.display700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textSecondary },
});

const s = StyleSheet.create({
  brandMark: { width: 36, height: 36, borderRadius: 9, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontFamily: fonts.display700, fontSize: 17, letterSpacing: -0.3, color: colors.textPrimary },
  brandBadge: { marginLeft: 4, backgroundColor: colors.accentLight, paddingHorizontal: 7, paddingVertical: 2, borderRadius: radius.pill },
  brandBadgeText: { fontFamily: fonts.bodyMedium, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', color: colors.accent },

  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.sm },
  btnText: { fontFamily: fonts.bodyMedium, fontSize: 14 },

  fieldLabel: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textSecondary, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 16 },
  input: { flex: 1, paddingVertical: 13, fontFamily: fonts.body, fontSize: 14.5, color: colors.textPrimary },
  fieldError: { fontFamily: fonts.body, fontSize: 12, color: colors.error, marginTop: 5 },

  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 20, ...shadow },

  meta: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: 24, paddingHorizontal: 22, ...shadow },
  category: { fontFamily: fonts.bodyMedium, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.accent, marginBottom: 8 },
  quizTitle: { fontFamily: fonts.display700, fontSize: 21, lineHeight: 25, letterSpacing: -0.5, color: colors.textPrimary, marginBottom: 12 },
  quizDescription: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 23, color: colors.textSecondary, marginBottom: 20 },
  statText: { fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary },
  statStrong: { fontFamily: fonts.bodyMedium, color: colors.textPrimary },

  track: { width: '100%', height: 6, backgroundColor: colors.border, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
});
