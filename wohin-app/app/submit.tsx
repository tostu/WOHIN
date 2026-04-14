import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/lib/api';
import { useRouter } from 'expo-router';

export default function SubmitScreen() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/api/v1/submissions/location', { name, address, description });
      setSubmitted(true);
    } catch (e) {
      console.error('Failed to submit:', e);
      alert('Failed to submit location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <Text style={styles.successEmoji}>🕊️</Text>
          <Text style={styles.successTitle}>Sent to the curators!</Text>
          <Text style={styles.successDescription}>
            We'll review your spot and add it to the radiant map soon. Thanks for being awesome! ✨
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setSubmitted(false);
              setName('');
              setAddress('');
              setDescription('');
            }}
          >
            <Text style={styles.buttonText}>Submit another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Share a {'\n'}
            <Text style={styles.italic}>new</Text> {'\n'}
            discovery.
          </Text>
          <Text style={styles.subTitle}>
            Help the community grow by adding your favorite radiant spots.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>SPOT NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., The Cozy Corner"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>WHERE IS IT?</Text>
            <TextInput
              style={styles.input}
              placeholder="Street, City"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>THE VIBE</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us why it's cool! ✨"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading || !name}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Share the Magic! ✨</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefcf4',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#2c2b29',
    lineHeight: 48,
    letterSpacing: -2,
  },
  italic: {
    fontStyle: 'italic',
    color: '#a8e6cf',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8b8a87',
    marginTop: 16,
    lineHeight: 24,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 24,
    shadowColor: '#2c2b29',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8b8a87',
    letterSpacing: 2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fefcf4',
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    color: '#2c2b29',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#ffb7b2',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2c2b29',
    textAlign: 'center',
    marginBottom: 12,
  },
  successDescription: {
    fontSize: 16,
    color: '#8b8a87',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  }
});
