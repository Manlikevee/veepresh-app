import { Theme, useStyles, useTheme } from '../../src/context/ThemeContext';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { Brand, Button, Card, FadeUp, Field, Page, useText } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const t = useText();
  const { signUp } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Enter your name';
    if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address';
    if (password.length < 6) e.password = 'Use at least 6 characters';
    if (confirm !== password) e.confirm = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await signUp(name.trim(), email.trim(), password); // dummy: always succeeds
    router.replace('/(app)');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <Page>
        <FadeUp style={{ marginTop: 24, marginBottom: 28 }}>
          <Brand />
        </FadeUp>
        <FadeUp delay={100}>
          <Text style={t.h1}>Create your account</Text>
          <Text style={[t.lead, { marginTop: 8, marginBottom: 24 }]}>Start turning your documents into quizzes.</Text>
        </FadeUp>
        <FadeUp delay={150}>
          <Card style={{ padding: 24 }}>
            <Field label="Full name" value={name} onChangeText={setName} placeholder="Your name" error={errors.name} />
            <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com"
              autoCapitalize="none" keyboardType="email-address" autoCorrect={false} error={errors.email} />
            <Field label="Password" value={password} onChangeText={setPassword} placeholder="At least 6 characters" secure error={errors.password} />
            <Field label="Confirm password" value={confirm} onChangeText={setConfirm} placeholder="Repeat password" secure error={errors.confirm} />
            <Button title="Sign up" size="lg" onPress={submit} loading={loading} style={{ marginTop: 4 }} />
          </Card>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 22 }}>
            <Text style={t.muted}>Already have an account? </Text>
            <Link href="/(auth)/login" style={t.link}>Log in</Link>
          </View>
        </FadeUp>
      </Page>
    </KeyboardAvoidingView>
  );
}
