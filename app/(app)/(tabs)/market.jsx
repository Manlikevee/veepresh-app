import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, Card, Chip, FadeUp, MetaCard, Page, SearchField, useText } from '../../../src/components/ui';
import { useApp } from '../../../src/context/AppContext';
import { useStyles, useTheme } from '../../../src/context/ThemeContext';
import { getMarketListings, listingQuestionCount, listingSections } from '../../../src/lib/market';
import { fonts } from '../../../src/theme';

const TYPES = [
  { value: 'all', label: 'All', icon: 'grid' },
  { value: 'collection', label: 'Collections', icon: 'layers' },
  { value: 'single', label: 'Single quizzes', icon: 'file-text' },
];

export default function Market() {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { sets, user } = useApp();
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [cat, setCat] = useState('All');

  const listings = useMemo(() => getMarketListings(sets, user), [sets, user]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(listings.map((l) => l.category).filter(Boolean)))], [listings]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return listings
      .filter((l) => type === 'all' || l.kind === type)
      .filter((l) => cat === 'All' || l.category === cat)
      .filter((l) => {
        if (!needle) return true;
        const haystack = [l.title, l.description, l.category, l.author, ...listingSections(l).map((x) => x.title)].join(' ').toLowerCase();
        return haystack.includes(needle);
      })
      .sort((a, b) => Number(b.mine) - Number(a.mine) || b.downloads - a.downloads); // your own public quizzes first, then most popular
  }, [listings, q, type, cat]);

  const inLibrary = (id) => sets.some((x) => x.sourceId === id);

  return (
    <Page tab>
      <FadeUp style={{ marginTop: 8 }}>
        <Text style={t.h1}>Marketplace</Text>
        <Text style={[t.lead, { marginTop: 8, marginBottom: 20 }]}>
          Discover public quizzes and collections. Mark one of yours as public in the Create tab to share it here.
        </Text>
      </FadeUp>

      <FadeUp delay={80} style={{ gap: 12 }}>
        <SearchField value={q} onChangeText={setQ} placeholder="Search title, topic or author" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {TYPES.map((x) => <Chip key={x.value} label={x.label} icon={x.icon} active={type === x.value} onPress={() => setType(x.value)} />)}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {categories.map((c) => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}
        </ScrollView>
      </FadeUp>

      <FadeUp delay={140} style={{ marginTop: 24 }}>
        <Text style={s.count}>{results.length} {results.length === 1 ? 'result' : 'results'}</Text>
        {results.length === 0 ? (
          <Card style={{ alignItems: 'center', paddingVertical: 30 }}>
            <Feather name="search" size={26} color={colors.textMuted} />
            <Text style={[t.lead, { textAlign: 'center', marginTop: 10 }]}>Nothing matches your search. Try a different word or clear the filters.</Text>
          </Card>
        ) : (
          <View style={{ gap: 16 }}>
            {results.map((l) => {
              const isCol = l.kind === 'collection';
              const stats = [];
              if (isCol) stats.push({ icon: 'layers', strong: `${listingSections(l).length} sections` });
              stats.push({ icon: 'file', strong: `${listingQuestionCount(l)} questions` });
              stats.push({ icon: 'user', strong: l.mine ? `${l.author} (you)` : l.author });
              if (!l.mine) stats.push({ icon: 'download', strong: l.downloads.toLocaleString(), post: ' added' });
              return (
                <MetaCard
                  key={l.id}
                  category={l.category}
                  title={l.title}
                  description={l.description}
                  descriptionLines={2}
                  onPress={() => router.push({ pathname: '/(app)/listing/[id]', params: { id: l.id } })}
                  right={
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      {isCol && <Badge label="Collection" tone="accent" icon="layers" />}
                      {l.mine && <Badge label="Yours" tone="success" icon="globe" />}
                      {!l.mine && inLibrary(l.id) && <Badge label="In library" tone="muted" icon="check" />}
                    </View>
                  }
                  stats={stats}
                />
              );
            })}
          </View>
        )}
        <Text style={s.note}>Demo mode: listings by other authors come from a local JSON file (src/data/marketplace.json).</Text>
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    count: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textSecondary, marginBottom: 12 },
    note: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, color: colors.textMuted, textAlign: 'center', marginTop: 20, paddingHorizontal: 12 },
  });
