import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { BackRow, Button, Card, FadeUp, Page, useText } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';
import { useStyles, useTheme } from '../../src/context/ThemeContext';
import { STARTER_COLLECTION_JSON, STARTER_JSON, buildSet, parseQuizJson } from '../../src/lib/quizSchema';
import { fonts, radius } from '../../src/theme';

const FORMAT_SINGLE = `{
  "title": "Quiz title",
  "category": "Subject (optional)",
  "description": "Optional",
  "questions": [
    {
      "text": "Question?",
      "options": ["A", "B", "C", "D"],
      "correct": 2,
      "points": 5,
      "feedback": "Optional explanation"
    }
  ]
}`;

const FORMAT_COLLECTION = `{
  "type": "collection",
  "title": "Collection title",
  "category": "Subject (optional)",
  "description": "Optional",
  "sections": [
    {
      "title": "Chapter 1",
      "description": "Optional",
      "questions": [ { ...same as above... } ]
    },
    { "title": "Chapter 2", "questions": [ ... ] }
  ]
}`;

export default function ImportJson() {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { addSet } = useApp();
  const [raw, setRaw] = useState('');
  const [errors, setErrors] = useState([]);

  const loadFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/plain', '*/*'], copyToCacheDirectory: true });
      if (res.canceled) return;
      const content = await FileSystem.readAsStringAsync(res.assets[0].uri);
      setRaw(content);
      setErrors([]);
    } catch {
      Alert.alert('Could not read file', 'Please choose a valid .json text file.');
    }
  };

  const create = () => {
    const result = parseQuizJson(raw.trim());
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    // imported quizzes always start private and in editing mode so you can review them before publishing
    const set = buildSet(result, { status: 'draft', visibility: 'private', origin: 'json' });
    addSet(set);
    router.replace({ pathname: '/(app)/editor/[id]', params: { id: set.id } });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <Page>
        <BackRow onBack={() => router.back()} />
        <FadeUp>
          <Text style={t.h1}>Import from JSON</Text>
          <Text style={[t.lead, { marginTop: 8, marginBottom: 20 }]}>
            Paste your questions or load a .json file. It can be a single quiz or a collection with sections. It is created in editing mode so you can review it before publishing.
          </Text>
        </FadeUp>

        <FadeUp delay={100}>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <Button title="Quiz template" variant="secondary" icon="file-text" onPress={() => { setRaw(STARTER_JSON); setErrors([]); }} style={{ flex: 1 }} />
            <Button title="Collection template" variant="secondary" icon="layers" onPress={() => { setRaw(STARTER_COLLECTION_JSON); setErrors([]); }} style={{ flex: 1 }} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <Button title="Load a .json file" variant="secondary" icon="upload" onPress={loadFile} style={{ flex: 1 }} />
          </View>

          <View style={[s.editor, errors.length > 0 && { borderColor: colors.error }]}>
            <TextInput
              value={raw}
              onChangeText={(v) => { setRaw(v); if (errors.length) setErrors([]); }}
              placeholder={'Paste JSON here…'}
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.accent}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              style={s.input}
            />
          </View>

          {errors.length > 0 && (
            <View style={s.errors}>
              <Text style={s.errorsTitle}>Fix these and try again</Text>
              {errors.slice(0, 8).map((e, i) => <Text key={i} style={s.errorLine}>• {e}</Text>)}
              {errors.length > 8 && <Text style={s.errorLine}>…and {errors.length - 8} more</Text>}
            </View>
          )}

          <Button title="Create (editing mode)" icon="check" size="lg" onPress={create} disabled={!raw.trim()} style={{ marginTop: 16 }} />
        </FadeUp>

        <FadeUp delay={150} style={{ marginTop: 28 }}>
          <Card>
            <Text style={[t.sectionTitle, { marginBottom: 10 }]}>Single quiz</Text>
            <Text style={s.code}>{FORMAT_SINGLE}</Text>
            <Text style={[t.sectionTitle, { marginTop: 18, marginBottom: 10 }]}>Collection (sections unlock in order)</Text>
            <Text style={s.code}>{FORMAT_COLLECTION}</Text>
            <Text style={[t.muted, { marginTop: 12, lineHeight: 19 }]}>
              "correct" can be the option number starting at 0, a letter like "C", or the exact answer text. Each question needs 2–6 options. You can also paste a plain array of questions.
            </Text>
          </Card>
        </FadeUp>
      </Page>
    </KeyboardAvoidingView>
  );
}

const mono = Platform.select({ ios: 'Menlo', default: 'monospace' });

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    editor: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm },
    input: { minHeight: 280, maxHeight: 420, padding: 14, fontFamily: mono, fontSize: 12.5, lineHeight: 18, color: colors.textPrimary, textAlignVertical: 'top' },
    errors: { marginTop: 12, padding: 14, borderRadius: radius.sm, backgroundColor: colors.errorLight, borderWidth: 1, borderColor: colors.feedbackErrorBorder, gap: 4 },
    errorsTitle: { fontFamily: fonts.display700, fontSize: 13, color: colors.feedbackErrorText, marginBottom: 4 },
    errorLine: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.feedbackErrorText },
    code: { fontFamily: mono, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  });
