import { Theme, useStyles, useTheme } from '../../src/context/ThemeContext';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { Brand, Button, Card, FadeUp, Field, Page, useText } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';
import { fonts } from '../../src/theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const t = useText();
  const { colors } = useTheme();
  const { signIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Enter your password';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await signIn(email.trim(), password); // dummy: always succeeds
    router.replace('/(app)');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <Page>
        <FadeUp style={{ marginTop: 24, marginBottom: 28 }}>
          <Brand />
        </FadeUp>
        <FadeUp delay={100}>
          <Text style={t.h1}>Welcome back</Text>
          <Text style={[t.lead, { marginTop: 8, marginBottom: 24 }]}>Log in to continue practising.</Text>
        </FadeUp>
        <FadeUp delay={150}>
          <Card style={{ padding: 24 }}>
            <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com"
              autoCapitalize="none" keyboardType="email-address" autoCorrect={false} error={errors.email} />
            <Field label="Password" value={password} onChangeText={setPassword} placeholder="Your password" secure error={errors.password} />
            <Button title="Log in" size="lg" onPress={submit} loading={loading} style={{ marginTop: 4 }} />
          </Card>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 22 }}>
            <Text style={t.muted}>New here? </Text>
            <Link href="/(auth)/signup" style={t.link}>Create an account</Link>
          </View>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 14 }}>
            Demo mode: any email and password will work.
          </Text>
        </FadeUp>
      </Page>
    </KeyboardAvoidingView>
  );
}
