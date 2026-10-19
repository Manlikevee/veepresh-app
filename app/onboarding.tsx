import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Brand, Button, FadeUp, IconName } from '../src/components/ui';
import { useApp } from '../src/context/AppContext';
import { MAX_CONTENT_WIDTH, colors, fonts, radius, shadow } from '../src/theme';

type Slide = { icon: IconName; title: string; text: string; tint: string; bg: string; tag: string };

const SLIDES: Slide[] = [
  {
    icon: 'file-text', tag: 'Upload', tint: colors.accent, bg: colors.accentLight,
    title: 'Turn any document into a quiz',
    text: 'Upload a PDF of your notes, textbook chapter or lecture slides and get a practice assessment in seconds.',
  },
  {
    icon: 'zap', tag: 'AI powered', tint: colors.tagTrueFalseText, bg: colors.tagTrueFalseBg,
    title: 'AI writes the questions',
    text: 'Multiple-choice questions with instant feedback that explains every answer.',
  },
  {
    icon: 'activity', tag: 'Progress', tint: colors.tagInputText, bg: colors.tagInputBg,
    title: 'Practise and track progress',
    text: 'Timed assessments, a 70% pass mark and a full answer review so you know exactly what to revise.',
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const { completeOnboarding } = useApp();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const last = index === SLIDES.length - 1;

  const finish = async () => {
    await completeOnboarding();
    router.replace('/(auth)/signup');
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  const next = () => (last ? finish() : listRef.current?.scrollToIndex({ index: index + 1, animated: true }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <View style={s.top}>
        <Brand />
        {!last && <Button title="Skip" variant="link" onPress={finish} />}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.title}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={[s.slide, { width }]}>
            <FadeUp style={s.card}>
              <View style={[s.iconTile, { backgroundColor: item.bg }]}>
                <Feather name={item.icon} size={56} color={item.tint} />
              </View>
              <View style={[s.tag, { backgroundColor: item.bg }]}>
                <Text style={[s.tagText, { color: item.tint }]}>{item.tag}</Text>
              </View>
              <Text style={s.title}>{item.title}</Text>
              <Text style={s.text}>{item.text}</Text>
            </FadeUp>
          </View>
        )}
      />

      <View style={s.footer}>
        <View style={s.dots}>
          {SLIDES.map((_, i) => <View key={i} style={[s.dot, i === index && s.dotActive]} />)}
        </View>
        <Button title={last ? 'Get started' : 'Next'} iconRight="chevron-right" size="lg" onPress={next} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16 },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  card: {
    width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignItems: 'center', backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: 40, paddingHorizontal: 24, ...shadow,
  },
  iconTile: { width: 132, height: 132, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  tag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill, marginBottom: 14 },
  tagText: { fontFamily: fonts.bodyMedium, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase' },
  title: { fontFamily: fonts.display700, fontSize: 26, lineHeight: 31, letterSpacing: -0.5, color: colors.textPrimary, textAlign: 'center', marginBottom: 12 },
  text: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 23, color: colors.textSecondary, textAlign: 'center' },
  footer: { paddingHorizontal: 16, paddingBottom: 20, paddingTop: 8, gap: 20, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 99, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.accent },
});
