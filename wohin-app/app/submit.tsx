import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/lib/api';
import { useRouter } from 'expo-router';
import { useSession } from '@/lib/auth';
import { useLocation } from '@/hooks/use-location';
import { MapPin } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function SubmitScreen() {
  const { data: session, isPending } = useSession();
  const { location: currentUserLocation } = useLocation();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const theme = useAppTheme();

  if (isPending) {
    return (
      <View style={StyleSheet.flatten([styles.container, { backgroundColor: theme.background }])}>
        <ActivityIndicator size="large" color={theme.accent.peach} />
      </View>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: theme.background }])}>
        <View style={styles.successContent}>
          <Text style={styles.successEmoji}>🔒</Text>
          <Text style={StyleSheet.flatten([styles.successTitle, { color: theme.ink }])}>Sign in first</Text>
          <Text style={StyleSheet.flatten([styles.successDescription, { color: theme.muted }])}>
            You need to be signed in to submit a spot.
          </Text>
          <TouchableOpacity style={StyleSheet.flatten([styles.button, { backgroundColor: theme.accent.peach }])} onPress={() => router.push('/login')}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSetCurrentLocation = () => {
    if (currentUserLocation) {
      setCoordinates({
        lat: currentUserLocation.latitude,
        lng: currentUserLocation.longitude
      });
      alert("Current location set! ✨");
    } else {
      alert("Location not available yet. Please wait a moment.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/api/v1/submissions/location', { 
        name, 
        address, 
        description,
        coordinates // Will be mapped to geopoint in Sanity
      });
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
      <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: theme.background }])}>
        <View style={styles.successContent}>
          <Text style={styles.successEmoji}>🕊️</Text>
          <Text style={StyleSheet.flatten([styles.successTitle, { color: theme.ink }])}>Sent to the curators!</Text>
          <Text style={StyleSheet.flatten([styles.successDescription, { color: theme.muted }])}>
            {"We'll review your spot and add it to the radiant map soon. Thanks for being awesome! ✨"}
          </Text>
          <TouchableOpacity
            style={StyleSheet.flatten([styles.button, { backgroundColor: theme.accent.peach }])}
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
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: theme.background }])}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={StyleSheet.flatten([styles.title, { color: theme.ink }])}>
            Share a {'\n'}
            <Text style={StyleSheet.flatten([styles.italic, { color: theme.accent.matcha }])}>new</Text> {'\n'}
            discovery.
          </Text>
          <Text style={StyleSheet.flatten([styles.subTitle, { color: theme.muted }])}>
            Help the community grow by adding your favorite radiant spots.
          </Text>
        </View>

        <View style={StyleSheet.flatten([styles.form, { backgroundColor: theme.surface, shadowColor: theme.shadow }])}>
          <View style={styles.inputGroup}>
            <Text style={StyleSheet.flatten([styles.label, { color: theme.muted }])}>SPOT NAME</Text>
            <TextInput
              style={StyleSheet.flatten([styles.input, { backgroundColor: theme.background, color: theme.ink }])}
              placeholder="e.g., The Cozy Corner"
              placeholderTextColor={theme.muted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={StyleSheet.flatten([styles.label, { color: theme.muted }])}>WHERE IS IT?</Text>
            <TextInput
              style={StyleSheet.flatten([styles.input, { backgroundColor: theme.background, color: theme.ink }])}
              placeholder="Street, City"
              placeholderTextColor={theme.muted}
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity 
              style={StyleSheet.flatten([
                styles.locationButton, 
                { borderColor: theme.accent.peach },
                coordinates ? { backgroundColor: theme.accent.peach } : { backgroundColor: theme.accent.peach + '15' }
              ])} 
              onPress={handleSetCurrentLocation}
            >
              <MapPin size={16} color={coordinates ? "#fff" : theme.accent.peach} />
              <Text style={StyleSheet.flatten([
                styles.locationButtonText, 
                { color: theme.accent.peach },
                coordinates && { color: "#fff" }
              ])}>
                {coordinates ? "Location Captured! ✨" : "Use my current location"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={StyleSheet.flatten([styles.label, { color: theme.muted }])}>THE VIBE</Text>
            <TextInput
              style={StyleSheet.flatten([styles.input, styles.textArea, { backgroundColor: theme.background, color: theme.ink }])}
              placeholder="Tell us why it's cool! ✨"
              placeholderTextColor={theme.muted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={StyleSheet.flatten([styles.button, { backgroundColor: theme.accent.peach }])}
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
    lineHeight: 48,
    letterSpacing: -2,
  },
  italic: {
    fontStyle: 'italic',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    lineHeight: 24,
  },
  form: {
    borderRadius: 40,
    padding: 24,
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
    letterSpacing: 2,
    marginBottom: 8,
  },
  input: {
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  locationButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  button: {
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
    textAlign: 'center',
    marginBottom: 12,
  },
  successDescription: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  }
});
