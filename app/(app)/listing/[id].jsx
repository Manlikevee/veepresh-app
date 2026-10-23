import { Feather } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, BackRow, Button, Card, FadeUp, MetaCard, Page, SectionTitle, useText } from '../../../src/components/ui';
import { useApp } from '../../../src/context/AppContext';
import { useStyles, useTheme } from '../../../src/context/ThemeContext';
import { getMarketListings, listingQuestionCount, listingSections, listingToSet } from '../../../src/lib/market';
import { fonts, radius } from '../../../src/theme';

const formatDate = (iso) => {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function Listing() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { sets, user, addSet } = useApp();

  const listing = getMarketListings(sets, user).find((l) => l.id === id);
  if (!listing) return <Redirect href="/(app)/(tabs)/market" />;

  const isCol = listing.kind === 'collection';
  const sections = listingSections(listing);
  const total = listingQuestionCount(listing);
  const copy = sets.find((x) => x.sourceId === listing.id); // already added to the library?

  const open = (setId) => router.replace({ pathname: '/(app)/set/[id]', params: { id: setId } });
  const add = () => {
    const set = listingToSet(listing);
    addSet(set);
    open(set.id);
  };

  const stats = [];
  if (isCol) stats.push({ icon: 'layers', strong: `${sections.length} sections` });
  stats.push({ icon: 'file', strong: `${total} questions` });
  stats.push({ icon: 'user', strong: listing.mine ? `${listing.author} (you)` : listing.author, pre: 'by ' });
  if (!listing.mine) stats.push({ icon: 'download', strong: listing.downloads.toLocaleString(), post: ' added' });
  const date = formatDate(listing.publishedAt);
  if (date) stats.push({ icon: 'calendar', strong: date });

  return (
    <Page>
      <BackRow onBack={() => router.back()} />

      <FadeUp>
        <MetaCard
          category={listing.category}
          title={listing.title}
          description={listing.description}
          right={isCol ? <Badge label="Collection" tone="accent" icon="layers" /> : undefined}
          stats={stats}
        />
      </FadeUp>

      <FadeUp delay={80} style={{ marginTop: 16, gap: 12 }}>
        {listing.mine ? (
          <>
            <Button title="Open your quiz" iconRight="chevron-right" size="lg" onPress={() => open(listing.id)} />
            <Text style={s.note}>This is your public quiz. Other people can find it here and add a copy to their library.</Text>
          </>
        ) : copy ? (
          <>
            <Button title="Open in your library" iconRight="chevron-right" size="lg" onPress={() => open(copy.id)} />
            <Text style={s.note}>You already added this one.</Text>
          </>
        ) : (
          <>
            <Button title="Add to my library" icon="plus" size="lg" onPress={add} />
            <Text style={s.note}>Adds a private copy you can take any time, even offline. Your progress is yours alone.</Text>
          </>
        )}
      </FadeUp>

      <FadeUp delay={140} style={{ marginTop: 28 }}>
        <SectionTitle>{isCol ? 'What you will learn' : 'What is inside'}</SectionTitle>
        {isCol ? (
          <View style={{ gap: 10 }}>
            {sections.map((sec, i) => (
              <View key={i} style={s.section}>
                <View style={s.num}><Text style={s.numText}>{i + 1}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.sectionTitle}>{sec.title}</Text>
                  {!!sec.description && <Text style={s.sectionDesc}>{sec.description}</Text>}
                  <Text style={s.sectionMeta}>{sec.questions.length} questions</Text>
                </View>
              </View>
            ))}
            <Text style={s.note}>Sections unlock one after another as you pass them, so you never see questions from parts you haven't covered yet.</Text>
          </View>
        ) : (
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={s.num}><Feather name="file-text" size={16} color={colors.accent} /></View>
            <Text style={[t.lead, { flex: 1 }]}>{total} multiple-choice questions. You choose how many to answer each time.</Text>
          </Card>
        )}
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    note: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 19, color: colors.textMuted, textAlign: 'center' },
    section: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 16 },
    num: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accentLight, alignItems: 'center', justifyContent: 'center' },
    numText: { fontFamily: fonts.display700, fontSize: 14, color: colors.accent },
    sectionTitle: { fontFamily: fonts.display600, fontSize: 15, lineHeight: 21, letterSpacing: -0.2, color: colors.textPrimary },
    sectionDesc: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 20, color: colors.textSecondary, marginTop: 3 },
    sectionMeta: { fontFamily: fonts.body, fontSize: 12.5, color: colors.textMuted, marginTop: 8 },
  });
