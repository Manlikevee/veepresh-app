import { useStyles, useTheme } from '../../src/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BackRow, Button, Card } from '../../src/components/ui';
import { formatBytes } from '../../src/lib/quiz';
import { fonts, radius } from '../../src/theme';

/**
 * PDF preview.
 *  - iOS: WebView renders local PDFs natively.
 *  - Android: WebView can't render PDFs, so the file is handed to the phone's PDF viewer.
 */
export default function Preview() {
  const { colors, isDark } = useTheme();
  const s = useStyles(makeStyles);
  const { uri, name, size } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  const openExternally = async () => {
    try {
      const contentUri = await FileSystem.getContentUriAsync(uri);
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        type: 'application/pdf',
      });
    } catch {
      Alert.alert('No PDF viewer found', 'Install a PDF reader app to preview this file.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <BackRow onBack={() => router.back()} />
      </View>
      {Platform.OS === 'ios' ? (
        <View style={s.frame}>
          <WebView source={{ uri }} originWhitelist={['*']} allowFileAccess allowingReadAccessToURL={uri} onLoadEnd={() => setLoading(false)} style={{ flex: 1 }} />
          {loading && (
            <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
              <ActivityIndicator color={colors.accent} />
            </View>
          )}
        </View>
      ) : (
        <View style={{ padding: 16 }}>
          <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
            <View style={s.icon}><Feather name="file-text" size={30} color={colors.error} /></View>
            <Text style={s.name}>{name}</Text>
            <Text style={s.size}>{formatBytes(Number(size) || undefined)}</Text>
            <Button title="Open in PDF viewer" icon="external-link" size="lg" onPress={openExternally} style={{ alignSelf: 'stretch', marginTop: 24 }} />
          </Card>
        </View>
      )}
    </SafeAreaView>
  );
}

const makeStyles = ({ colors, shadow, shadowLg }) => StyleSheet.create({
  frame: { flex: 1, margin: 16, marginTop: 4, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', backgroundColor: colors.surface },
  icon: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.errorLight, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: fonts.display700, fontSize: 17, letterSpacing: -0.3, color: colors.textPrimary, textAlign: 'center', marginTop: 16 },
  size: { fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
