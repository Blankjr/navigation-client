import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Searchbar, List, Icon } from 'react-native-paper';
import Voice from '@react-native-voice/voice';
import { locations, Location } from '../../data/locations';
import { complexNames } from '../../data/complexNames';
import * as Speech from 'expo-speech';
import { useAudioStore } from '@/stores/useAudioStore';
import { useNavigationStore } from '@/stores/useNavigationStore';

// Generate room numbers from 1 to 40 with simple aliases
const generateRoomNumbers = () => {
  return Array.from({ length: 40 }, (_, i) => {
    const num = (i + 1).toString();
    const paddedNum = num.padStart(3, '0');
    return {
      id: `room-${paddedNum}`,
      name: `Raum ${num}`,
      type: 'room' as const,
      room: `04.2.${paddedNum}`,
      aliases: [num]
    } satisfies Location; 
  });
};

const allLocations = [...locations, ...generateRoomNumbers()];

interface EnhancedLocationSelectorProps {
  onLocationSelect: (location: Location) => void;
  forceUpdate?: () => void;
}

const EnhancedLocationSelector: React.FC<EnhancedLocationSelectorProps> = ({ onLocationSelect, forceUpdate }) => {
  const { isVisualMode } = useNavigationStore();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [matchConfidence, setMatchConfidence] = useState<number | null>(null);
  const speechRate = useAudioStore((state) => state.speechRate);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = handleSpeechResults;
    Voice.onSpeechError = handleSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const getLevenshteinDistance = (a: string, b: string) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
  
    const matrix = [];
  
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
  
    return matrix[b.length][a.length];
  };

  const getMatchScore = (spoken: string, target: string) => {
    const normalizedSpoken = spoken.toLowerCase().trim();
    const normalizedTarget = target.toLowerCase().trim();
  
    if (normalizedSpoken === normalizedTarget) {
      return 1.0;
    }

    // Check for complex name matches first
    for (const [complexName, variations] of Object.entries(complexNames)) {
      if (target.toLowerCase().includes(complexName)) {
        for (const variation of variations) {
          if (normalizedSpoken.includes(variation)) {
            return 0.95;
          }
          if (getLevenshteinDistance(variation, normalizedSpoken) <= 3) {
            return 0.9;
          }
        }
      }
    }
  
    const spokenWords = normalizedSpoken.split(/\s+/);
    const targetWords = normalizedTarget.split(/\s+/);
  
    let totalScore = 0;
    let matchedWords = 0;
  
    spokenWords.forEach(spokenWord => {
      let bestWordScore = 0;
      
      targetWords.forEach(targetWord => {
        if (targetWord.length < 3 || spokenWord.length < 3) {
          return;
        }
  
        const distance = getLevenshteinDistance(spokenWord, targetWord);
        const maxLength = Math.max(spokenWord.length, targetWord.length);
        let score = 1 - (distance / maxLength);
        
        if (targetWord.length > 8) {
          score = Math.min(1, score * 1.2);
        }
  
        bestWordScore = Math.max(bestWordScore, score);
      });
  
      if (bestWordScore > 0.6) {
        totalScore += bestWordScore;
        matchedWords++;
      }
    });
  
    if (matchedWords === 0) {
      return 0;
    }
  
    const matchRatio = matchedWords / Math.max(spokenWords.length, targetWords.length);
    return (totalScore / matchedWords) * matchRatio;
  };

  const findMatch = (spokenText: string) => {
    const normalizedInput = spokenText.toLowerCase().trim();
    let bestMatch: Location | null = null;
    let bestMatchScore = 0;
  
    allLocations.forEach(location => {
      const mainNameScore = getMatchScore(normalizedInput, location.name);
      let currentBestScore = mainNameScore;
      
      location.aliases.forEach(alias => {
        const aliasScore = getMatchScore(normalizedInput, alias);
        currentBestScore = Math.max(currentBestScore, aliasScore);
      });
  
      if (currentBestScore > bestMatchScore) {
        bestMatchScore = currentBestScore;
        bestMatch = location as Location;
      }
    });
  
    if (bestMatch && bestMatchScore > 0.65) {
      const match: Location = bestMatch;
      setSearchQuery(match.name);
      setMatchConfidence(Math.round(bestMatchScore * 100));
      onLocationSelect(match);
    } else {
      setError('Ziel nicht erkannt. Bitte wiederholen');
      setMatchConfidence(null);
      Speech.speak('Bitte nochmal', {
        language: 'de-DE',
        rate: speechRate
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const searchLower = query.toLowerCase();
      const filtered = allLocations.filter(location => {
        if (location.name.toLowerCase().includes(searchLower)) return true;
        return location.aliases.some(alias => 
          alias.toLowerCase().includes(searchLower)
        );
      });
      
      setFilteredLocations(filtered);
      setShowDropdown(true);
    } else {
      setFilteredLocations([]);
      setShowDropdown(false);
    }
  };

  const handleLocationPress = (location: Location) => {
    setSearchQuery(location.name);
    setShowDropdown(false);
    if (forceUpdate) forceUpdate();
    onLocationSelect(location);
  };

  const handleSpeechResults = (e: any) => {
    setResults(e.value);
    findMatch(e.value[0]);
  };

  const handleSpeechError = (e: any) => {
    setError('Ziel nicht erkannt.');
    setIsListening(false);
    Speech.speak('Bitte nochmal', {
      language: 'de-DE',
      rate: speechRate
    });
  };

  const startListening = async () => {
    try {
      setError('');
      await Voice.start('de-DE');
    } catch (e) {
      setError('Error starting voice recognition: ' + e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      setError('Error stopping voice recognition: ' + e);
    }
  };

  return (
    <View style={[
      styles.container,
      !isVisualMode && styles.tactileContainer
    ]}>
      {isVisualMode && (
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Raum oder Name"
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchBarInput}
            iconColor="#0052CC"
            placeholderTextColor="#666666"
          />
          
          {showDropdown && filteredLocations.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredLocations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <List.Item
                    title={item.name}
                    titleStyle={styles.dropdownItemText}
                    onPress={() => handleLocationPress(item)}
                    style={styles.dropdownItem}
                  />
                )}
                style={styles.dropdownList}
              />
            </View>
          )}
        </View>
      )}

      <View style={[
        styles.voiceContainer,
        !isVisualMode && styles.tactileVoiceContainer
      ]}>
        <TouchableOpacity
          style={[
            styles.voiceButton,
            isListening && styles.buttonListening,
            !isVisualMode && styles.tactileVoiceButton
          ]}
          onPress={isListening ? stopListening : startListening}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isListening ? "Sprachaufnahme stoppen" : "Sprachaufnahme starten"}
          accessibilityHint={isListening ? "Beendet die Aufnahme" : "Startet die Sprachaufnahme zur Zielauswahl"}
        >
          <Text>
            {isListening ? (
              <Icon source="stop" size={!isVisualMode ? 120 : 80} color="#FFFFFF" />
            ) : (
              <Icon source="microphone" size={!isVisualMode ? 120 : 80} color="#FFFFFF" />
            )}
          </Text>
        </TouchableOpacity>


      </View>
    </View>
  );
};

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tactileContainer: {
    padding: 10,
    justifyContent: 'center',
  },
  searchContainer: {
    position: 'relative',
    zIndex: 1,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 4,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0052CC',
  },
  searchBarInput: {
    fontSize: 24,
    height: 70,
    color: '#000000',
  },
  dropdown: {
    position: 'absolute',
    bottom: 74,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 4,
    maxHeight: Math.min(300, screenHeight * 0.4),
    borderWidth: 2,
    borderColor: '#0052CC',
    zIndex: 1000,
  },
  dropdownList: {
    flex: 1,
  },
  dropdownItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    minHeight: 60,
    justifyContent: 'center',
  },
  dropdownItemText: {
    fontSize: 20,
    color: '#000000',
    padding: 12,
  },
  voiceContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  tactileVoiceContainer: {
    marginTop: 0,
    flex: 1,
    justifyContent: 'center',
  },
  voiceButton: {
    backgroundColor: '#0052CC',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    minHeight: 180,
    justifyContent: 'center',
  },
  tactileVoiceButton: {
    minHeight: 300,
    borderWidth: 4,
    borderColor: '#003380',
  },
  buttonListening: {
    backgroundColor: '#DC2626',
  },
  buttonIcon: {
    alignSelf: 'center',
  },
});

export default EnhancedLocationSelector;