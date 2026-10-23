import { useStyles, useTheme } from '../../src/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { BackRow, Button, Card, FadeUp, Field, Page, ProgressBar, Segmented, useText } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';
import { formatBytes } from '../../src/lib/quiz';
import { generateQuestionSet, generationStages } from '../../src/services/ai';
import { fonts, radius } from '../../src/theme';

const MAX_BYTES = 25 * 1024 * 1024;

export default function Upload() {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { addSet } = useApp();
  const [doc, setDoc] = useState(null);
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('collection'); // 'single' | 'collection'
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);

  const pick = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true, multiple: false });
    if (res.canceled) return;
    const f = res.assets[0];
    if (f.size && f.size > MAX_BYTES) {
      Alert.alert('File too large', 'Please choose a PDF smaller than 25 MB.');
      return;
    }
    if (f.mimeType && f.mimeType !== 'application/pdf') {
      Alert.alert('Unsupported file', 'Only PDF documents are supported.');
      return;
    }
    setDoc({ uri: f.uri, name: f.name, size: f.size, mimeType: f.mimeType });
    setTitle(f.name.replace(/\.pdf$/i, ''));
  };

  const preview = () =>
    doc && router.push({ pathname: '/(app)/preview', params: { uri: doc.uri, name: doc.name, size: String(doc.size ?? '') } });

  const generate = async () => {
    if (!doc) return;
    setBusy(true);
    try {
      const set = await generateQuestionSet({ doc, title, kind, onStage: setStage });
      addSet(set);
      router.replace({ pathname: '/(app)/set/[id]', params: { id: set.id } });
    } catch {
      Alert.alert('Something went wrong', 'We could not generate questions. Please try again.');
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <Page>
        <BackRow onBack={() => router.back()} />
        <FadeUp>
          <Text style={t.h1}>Generate questions</Text>
          <Text style={[t.lead, { marginTop: 8, marginBottom: 24 }]}>Upload a PDF and we'll turn it into a quiz, or a chapter-by-chapter collection.</Text>
        </FadeUp>

        <FadeUp delay={100}>
          {!doc ? (
            <Card style={s.drop}>
              <View style={s.dropIcon}>
                <Feather name="upload-cloud" size={28} color={colors.accent} />
              </View>
              <Text style={s.dropTitle}>Upload a PDF</Text>
              <Text style={s.dropText}>Choose the document you want your questions generated from. Max 25 MB.</Text>
              <Button title="Choose PDF" icon="file-plus" size="lg" onPress={pick} style={{ alignSelf: 'stretch', marginTop: 20 }} />
            </Card>
          ) : (
            <>
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={s.pdfBadge}>
                    <Feather name="file-text" size={22} color={colors.error} />
                    <Text style={s.pdfText}>PDF</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.fileName} numberOfLines={2}>{doc.name}</Text>
                    <View style={s.sizeBadge}><Text style={s.sizeText}>{formatBytes(doc.size)}</Text></View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 18, paddingTop: 18, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <Button title="Preview" variant="secondary" icon="eye" onPress={preview} disabled={busy} style={{ flex: 1 }} />
                  <Button title="Replace" variant="secondary" icon="refresh-cw" onPress={pick} disabled={busy} style={{ flex: 1 }} />
                </View>
              </Card>

              <View style={{ marginTop: 24 }}>
                <Text style={s.label}>What should we make?</Text>
                <Segmented
                  value={kind}
                  onChange={(v) => !busy && setKind(v)}
                  options={[
                    { value: 'collection', label: 'By chapter', icon: 'layers' },
                    { value: 'single', label: 'One quiz', icon: 'file-text' },
                  ]}
                />
                <Text style={s.kindNote}>
                  {kind === 'collection'
                    ? 'Questions are grouped by chapter. Each chapter unlocks after you pass the one before, so you only see questions about what you have already studied.'
                    : 'A single set of questions from the whole document, taken in one go.'}
                </Text>
              </View>

              <View style={{ marginTop: 24 }}>
                <Field label={kind === 'collection' ? 'Collection name' : 'Question set name'} value={title} onChangeText={setTitle} placeholder="e.g. Chapter 4 revision" editable={!busy} />
              </View>

              {busy ? (
                <Card style={{ alignItems: 'center', paddingVertical: 26 }}>
                  <Feather name="zap" size={26} color={colors.accent} />
                  <Text style={s.stage}>{generationStages(kind)[stage]}</Text>
                  <View style={{ alignSelf: 'stretch', marginTop: 16 }}>
                    <ProgressBar pct={((stage + 1) / generationStages(kind).length) * 100} />
                  </View>
                </Card>
              ) : (
                <Button title={kind === 'collection' ? 'Generate collection' : 'Generate questions'} icon="zap" size="lg" onPress={generate} />
              )}
              <Text style={s.note}>Demo mode: your file stays on this device. Sample questions are returned for now (a Python course for collections).</Text>
            </>
          )}
        </FadeUp>
      </Page>
    </KeyboardAvoidingView>
  );
}

const makeStyles = ({ colors, shadow, shadowLg }) => StyleSheet.create({
  drop: { alignItems: 'center', paddingVertical: 32, borderStyle: 'dashed', borderWidth: 1.5 },
  dropIcon: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.accentLight, alignItems: 'center', justifyContent: 'center' },
  dropTitle: { fontFamily: fonts.display700, fontSize: 19, letterSpacing: -0.3, color: colors.textPrimary, marginTop: 16 },
  dropText: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 23, color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
  pdfBadge: { width: 52, height: 60, borderRadius: radius.sm, backgroundColor: colors.errorLight, alignItems: 'center', justifyContent: 'center', gap: 2 },
  pdfText: { fontFamily: fonts.display700, fontSize: 10, letterSpacing: 1, color: colors.error },
  fileName: { fontFamily: fonts.display600, fontSize: 15, lineHeight: 21, letterSpacing: -0.2, color: colors.textPrimary },
  sizeBadge: { alignSelf: 'flex-start', marginTop: 8, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  sizeText: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textSecondary },
  label: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textSecondary, marginBottom: 8 },
  kindNote: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 19, color: colors.textMuted, marginTop: 10 },
  stage: { fontFamily: fonts.bodyMedium, fontSize: 14.5, color: colors.textPrimary, marginTop: 12 },
  note: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, color: colors.textMuted, textAlign: 'center', marginTop: 16 },
});
