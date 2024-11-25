import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import Voice from '@react-native-voice/voice';
import { locations, Location } from '../../data/locations';
import { complexNames } from '../../data/complexNames';

interface VoiceSelectorProps {
  onLocationSelect: (location: Location) => void;
}


const VoiceSelector: React.FC<VoiceSelectorProps> = ({ onLocationSelect }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [matchedLocation, setMatchedLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string>('');
  const [matchConfidence, setMatchConfidence] = useState<number | null>(null);
  const [showLocations, setShowLocations] = useState<boolean>(false);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = handleSpeechResults;
    Voice.onSpeechError = handleSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleSpeechResults = (e) => {
    setResults(e.value);
    findMatch(e.value[0]);
  };

  const handleSpeechError = (e) => {
    setError('Error with speech recognition: ' + e.error?.message);
    setIsListening(false);
  };

  const getLevenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
  
    const matrix = [];
  
    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  
    // Fill matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
  
    return matrix[b.length][a.length];
  };
  
  const getMatchScore = (spoken, target) => {
    // Normalize strings for comparison
    const normalizedSpoken = spoken.toLowerCase().trim();
    const normalizedTarget = target.toLowerCase().trim();
  
    // If strings are exactly equal, return perfect match
    if (normalizedSpoken === normalizedTarget) {
      return 1.0;
    }

    // Check for complex name matches first
  for (const [complexName, variations] of Object.entries(complexNames)) {
    if (target.toLowerCase().includes(complexName)) {
      // If this is a complex name, check against all its variations
      for (const variation of variations) {
        if (normalizedSpoken.includes(variation)) {
          return 0.95; // High confidence match for complex name variation
        }
        // Check for partial matches in complex names
        if (getLevenshteinDistance(variation, normalizedSpoken) <= 3) {
          return 0.9; // Good confidence for close match
        }
      }
    }
  }
  
   // Split into words
   const spokenWords = normalizedSpoken.split(/\s+/);
   const targetWords = normalizedTarget.split(/\s+/);
 
   // Calculate word-by-word matching scores
   let totalScore = 0;
   let matchedWords = 0;
 
   spokenWords.forEach(spokenWord => {
     let bestWordScore = 0;
     
     targetWords.forEach(targetWord => {
       // Skip very short words (like articles)
       if (targetWord.length < 3 || spokenWord.length < 3) {
         return;
       }
 
       const distance = getLevenshteinDistance(spokenWord, targetWord);
       const maxLength = Math.max(spokenWord.length, targetWord.length);
       let score = 1 - (distance / maxLength);
       
       // Be more lenient with longer words (they're harder to pronounce correctly)
       if (targetWord.length > 8) {
         score = Math.min(1, score * 1.2); // Boost score for long words
       }
 
       bestWordScore = Math.max(bestWordScore, score);
     });
 
     if (bestWordScore > 0.6) { // More lenient threshold for word matches
       totalScore += bestWordScore;
       matchedWords++;
     }
   });
 
   // Calculate final score
   if (matchedWords === 0) {
     return 0;
   }
 
   // Weight the score by the proportion of words matched
   const matchRatio = matchedWords / Math.max(spokenWords.length, targetWords.length);
   const finalScore = (totalScore / matchedWords) * matchRatio;
 
   return finalScore;
 };
 
 const findMatch = (spokenText) => {
   const normalizedInput = spokenText.toLowerCase().trim();
   console.log('Spoken text:', normalizedInput);
 
   let bestMatch = null;
   let bestMatchScore = 0;
 
   locations.forEach(location => {
     // Check main name
     const mainNameScore = getMatchScore(normalizedInput, location.name);
     let currentBestScore = mainNameScore;
     
     // Check aliases
     location.aliases.forEach(alias => {
       const aliasScore = getMatchScore(normalizedInput, alias);
       currentBestScore = Math.max(currentBestScore, aliasScore);
     });
 
     console.log(`Matching "${normalizedInput}" against "${location.name}": ${currentBestScore}`);
 
     if (currentBestScore > bestMatchScore) {
       bestMatchScore = currentBestScore;
       bestMatch = location;
     }
   });
 
   console.log('Best match score:', bestMatchScore);
 
   // More lenient threshold for accepting matches
   if (bestMatch && bestMatchScore > 0.65) {
     setMatchedLocation(bestMatch);
     setMatchConfidence(Math.round(bestMatchScore * 100));
     onLocationSelect(bestMatch);
   } else {
     setError('No matching location found. Please try again.');
     setMatchConfidence(null);
   }
 };

  const startListening = async () => {
    try {
      setError('');
      setMatchedLocation(null);
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

  const toggleLocationsList = () => {
    setShowLocations(!showLocations);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isListening && styles.buttonListening]}
        onPress={isListening ? stopListening : startListening}
      >
        <Text style={styles.buttonText}>
          {isListening ? 'Stop' : 'Sprachsuche'}
        </Text>
      </TouchableOpacity>

      {isListening && (
        <Text style={styles.listeningText}>Listening...</Text>
      )}

      {matchedLocation && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            gefunden: {matchedLocation.name} 
            {matchedLocation.room ? ` (Room ${matchedLocation.room})` : ` (${matchedLocation.type})`}
            {matchConfidence && (
              <Text style={styles.confidenceText}>
                {'\n'}Genauigkeit: {matchConfidence}%
              </Text>
            )}
          </Text>
        </View>
      )}

      {error !== '' && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <TouchableOpacity 
        style={styles.locationToggle}
        onPress={toggleLocationsList}
      >
        <Text style={styles.locationToggleText}>
          {showLocations ? '▼ Verfügbare Ziele' : '▶ Zeige verfügbare Ziele'}
        </Text>
      </TouchableOpacity>

      {showLocations && (
        <View style={styles.availableLocations}>
          <FlatList
            data={locations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.locationItem}>
                <Text style={styles.locationName}>
                  • {item.name}
                  {item.room ? ` (${item.room})` : ''}
                </Text>
                {item.aliases.length > 0 && (
                  <Text style={styles.aliasText}>
                    Auch: {item.aliases.join(', ')}
                  </Text>
                )}
              </View>
            )}
            style={styles.locationsList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonListening: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listeningText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  confidenceText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  errorText: {
    marginTop: 20,
    color: '#FF3B30',
    textAlign: 'center',
  },
  locationToggle: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  locationToggleText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  availableLocations: {
    marginTop: 10,
    height: Dimensions.get('window').height * 0.25, // Takes up 25% of screen height
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    overflow: 'hidden',
  },
  locationsList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  locationName: {
    fontSize: 15,
    color: '#333',
  },
  aliasText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 15,
    marginTop: 2,
  },
  locationItem: {
    marginBottom: 8,
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDD',
  },
});

export default VoiceSelector;