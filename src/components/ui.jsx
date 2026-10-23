import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyles, useTheme } from '../context/ThemeContext';
import { MAX_CONTENT_WIDTH, fonts, radius } from '../theme';

/* ── Page shell: bg, 16px padding, 760px max width ── */
export function Page({
  children, scroll = true, tab = false, contentStyle,
}) {
  const { colors, isDark } = useTheme();
  const edges = tab ? ['top', 'left', 'right'] : ['top', 'bottom', 'left', 'right'];
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {scroll ? (
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingBottom: 48, alignItems: 'center' }}>
          <View style={[{ width: '100%', maxWidth: MAX_CONTENT_WIDTH }, contentStyle]}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, padding: 16, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' }, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

/* ── @keyframes fadeUp ── */
export function FadeUp({ children, delay = 0, style }) {
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

/* ── app logo (assets/images/logo.png) ── */
export function Logo({ size = 36 }) {
  return (
    <Image
      source={require('../../assets/images/logo.png')}
      style={{ width: size, height: size, borderRadius: size * 0.23 }}
      accessibilityLabel="Veepresh logo"
    />
  );
}

/* ── .brand-mark + .brand-name + .brand-badge ── */
export function Brand({ badge = 'Quiz', size = 36 }) {
  const s = useStyles(makeStyles);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Logo size={size} />
      <Text style={s.brandName}>Veepresh</Text>
      {!!badge && <View style={s.brandBadge}><Text style={s.brandBadgeText}>{badge}</Text></View>}
    </View>
  );
}

/* ── search box ── */
export function SearchField({ value, onChangeText, placeholder = 'Search' }) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const [focused, setFocused] = useState(false);
  return (
    <View style={[s.inputWrap, { paddingHorizontal: 14, gap: 10 }, focused && { borderColor: colors.accent }]}>
      <Feather name="search" size={17} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={s.input}
      />
      {!!value && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Feather name="x-circle" size={17} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

/* ── filter chip ── */
export function Chip({ label, active, onPress, icon }) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  return (
    <Pressable onPress={onPress} style={[s.chip, active && { backgroundColor: colors.accentLight, borderColor: colors.accent }]}>
      {icon && <Feather name={icon} size={13} color={active ? colors.accent : colors.textSecondary} />}
      <Text style={[s.chipText, active && { color: colors.accent }]}>{label}</Text>
    </Pressable>
  );
}

export function Button({ title, onPress, variant = 'primary', size = 'md', icon, iconRight, loading, disabled, style }) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
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
        variant === 'secondary' && { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: pressed ? colors.accent : colors.border, paddingHorizontal: 20, opacity: off ? 0.5 : 1 },
        variant === 'danger' && { backgroundColor: pressed ? colors.errorLight : colors.surface, borderWidth: 1.5, borderColor: colors.feedbackErrorBorder, paddingHorizontal: 20, opacity: off ? 0.5 : 1 },
        variant === 'link' && { paddingHorizontal: 0, paddingVertical: 4, opacity: off ? 0.5 : 1 },
        style,
      ]}
    >
      {({ pressed }) => {
        const fg =
          variant === 'primary' ? '#fff'
          : variant === 'link' ? colors.textMuted
          : variant === 'danger' ? colors.error
          : pressed ? colors.accent : colors.textPrimary;
        return loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            {icon && <Feather name={icon} size={15} color={fg} />}
            <Text style={[s.btnText, { color: fg }, variant === 'primary' && { letterSpacing: -0.1 }, variant === 'link' && { fontSize: 13, textDecorationLine: 'underline' }]}>
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
export function Field({
  label, error, secure, hint, compact, ...rest
}) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const [hidden, setHidden] = useState(!!secure);
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: compact ? 0 : 16, flex: compact ? 1 : undefined }}>
      {!!label && <Text style={s.fieldLabel}>{label}</Text>}
      <View style={[s.inputWrap, focused && { borderColor: colors.accent }, !!error && { borderColor: colors.error }]}>
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          style={[s.input, rest.multiline && { minHeight: 84, textAlignVertical: 'top' }, rest.style]}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Feather name={hidden ? 'eye' : 'eye-off'} size={17} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {!!hint && !error && <Text style={s.fieldHint}>{hint}</Text>}
      {!!error && <Text style={s.fieldError}>{error}</Text>}
    </View>
  );
}

export function Card({ children, style }) {
  const s = useStyles(makeStyles);
  return <View style={[s.card, style]}>{children}</View>;
}

export function StatRow({ items, bordered = true }) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
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
  category, title, description, stats, onPress, descriptionLines, right, footer,
}) {
  const s = useStyles(makeStyles);
  const body = (
    <View style={s.meta}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <Text style={[s.category, { flex: 1 }]}>{category}</Text>
        {right}
      </View>
      <Text style={s.quizTitle}>{title}</Text>
      {!!description && <Text style={s.quizDescription} numberOfLines={descriptionLines}>{description}</Text>}
      {!description && <View style={{ height: 8 }} />}
      <StatRow items={stats} />
      {footer}
    </View>
  );
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.92 }}>{body}</Pressable> : body;
}

/* ── .progress-track / .progress-fill (animated width, 0.4s) ── */
export function ProgressBar({ pct }) {
  const s = useStyles(makeStyles);
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

export function BackRow({ onBack, right, title }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
      <Button title={title ?? 'Back'} variant="secondary" icon="chevron-left" onPress={onBack} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />
      {right}
    </View>
  );
}

/* ── small pill (.question-type-tag style) ── */
export function Badge({ label, tone = 'accent', icon }) {
  const { colors } = useTheme();
  const map = {
    accent: [colors.accentLight, colors.accent],
    success: [colors.successLight, colors.success],
    warning: [colors.warningLight, colors.warning],
    error: [colors.errorLight, colors.error],
    muted: [colors.surface2, colors.textSecondary],
  }[tone];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: map[0], paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill, alignSelf: 'flex-start' }}>
      {icon && <Feather name={icon} size={11} color={map[1]} />}
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: map[1] }}>{label}</Text>
    </View>
  );
}

/* ── segmented control ── */
export function Segmented({
  options, value, onChange,
}) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  return (
    <View style={s.segWrap}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable key={o.value} onPress={() => onChange(o.value)} style={[s.segItem, on && { backgroundColor: colors.accentLight, borderColor: colors.accent }]}>
            {o.icon && <Feather name={o.icon} size={15} color={on ? colors.accent : colors.textSecondary} />}
            <Text style={[s.segText, on && { color: colors.accent }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ── settings-style row ── */
export function Row({
  icon, label, sub, right, onPress, danger, last,
}) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const content = (
    <View style={[s.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
      <View style={[s.rowIcon, danger && { backgroundColor: colors.errorLight }]}>
        <Feather name={icon} size={16} color={danger ? colors.error : colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.rowLabel, danger && { color: colors.error }]}>{label}</Text>
        {!!sub && <Text style={s.rowSub}>{sub}</Text>}
      </View>
      {right ?? (onPress ? <Feather name="chevron-right" size={16} color={colors.textMuted} /> : null)}
    </View>
  );
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.7 }}>{content}</Pressable> : content;
}

export function Toggle({ value, onValueChange, disabled }) {
  const { colors } = useTheme();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: colors.border, true: colors.accent }}
      thumbColor="#fff"
      ios_backgroundColor={colors.border}
    />
  );
}

export function SectionTitle({ children, style }) {
  const t = useText();
  return <Text style={[t.sectionTitle, { marginBottom: 12 }, style]}>{children}</Text>;
}

/* ── typography helpers ── */
const makeText = ({ colors }) =>
  StyleSheet.create({
    h1: { fontFamily: fonts.display700, fontSize: 26, lineHeight: 31, letterSpacing: -0.5, color: colors.textPrimary },
    lead: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 23, color: colors.textSecondary },
    muted: { fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary },
    link: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.accent },
    sectionTitle: { fontFamily: fonts.display700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textSecondary },
  });
export const useText = () => useStyles(makeText);

const makeStyles = ({ colors, shadow }) =>
  StyleSheet.create({
    brandName: { fontFamily: fonts.display700, fontSize: 17, letterSpacing: -0.3, color: colors.textPrimary },
    brandBadge: { marginLeft: 4, backgroundColor: colors.accentLight, paddingHorizontal: 7, paddingVertical: 2, borderRadius: radius.pill },
    brandBadgeText: { fontFamily: fonts.bodyMedium, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', color: colors.accent },

    btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.sm },
    btnText: { fontFamily: fonts.bodyMedium, fontSize: 14 },

    fieldLabel: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textSecondary, marginBottom: 6 },
    inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 16 },
    input: { flex: 1, paddingVertical: 13, fontFamily: fonts.body, fontSize: 14.5, color: colors.textPrimary },
    fieldHint: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, marginTop: 5 },
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

    chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill },
    chipText: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textSecondary },

    segWrap: { flexDirection: 'row', gap: 8 },
    segItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
    segText: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.textSecondary },

    row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
    rowIcon: { width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.accentLight, alignItems: 'center', justifyContent: 'center' },
    rowLabel: { fontFamily: fonts.bodyMedium, fontSize: 14.5, color: colors.textPrimary },
    rowSub: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18, color: colors.textSecondary, marginTop: 2 },
  });
