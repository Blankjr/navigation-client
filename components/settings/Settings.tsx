import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useAudioStore } from '../../stores/useAudioStore';
import { useNavigationStore } from '../../stores/useNavigationStore';

const Settings: React.FC = () => {
  const { speechRate, setSpeechRate } = useAudioStore();
  const { 
    isVisualMode, 
    setVisualMode,
    isWlanFingerprinting,
    setWlanFingerprinting 
  } = useNavigationStore();

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel="Einstellungen"
      accessibilityRole="menu"
    >
      <Text 
        style={styles.title}
        accessibilityRole="header"
      >
        Sprache
      </Text>
      
      <View 
        style={styles.sliderContainer}
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel={`Sprechgeschwindigkeit: ${speechRate.toFixed(1)}x`}
        accessibilityHint="Ziehen Sie den Schieberegler nach links für langsamere oder nach rechts für schnellere Sprachausgabe"
      >
        <Text style={styles.sliderLabel}>
          Geschwindigkeit: {speechRate.toFixed(1)}x
        </Text>
        <Slider
          style={styles.slider}
          value={speechRate}
          onValueChange={setSpeechRate}
          minimumValue={0.5}
          maximumValue={2.0}
          step={0.1}
          minimumTrackTintColor="#0052CC"
          maximumTrackTintColor="#000000"
          thumbTintColor="#0052CC"
        />
      </View>

      <View 
        style={styles.switchContainer}
        accessible={true}
        accessibilityRole="radiogroup"
        accessibilityLabel="Navigationsmodus Auswahl"
      >
        <Text 
          style={styles.switchLabel}
          accessibilityRole="header"
        >
          Navigationsmodus
        </Text>
        <View 
          style={styles.switchRow}
          accessibilityRole="radio"
          accessibilityState={{ checked: !isVisualMode }}
          accessibilityHint="Wechselt zwischen taktilem und visuellem Navigationsmodus"
        >
          <Text 
            style={[
              styles.modeText,
              !isVisualMode && styles.activeText
            ]}
          >
            Taktil
          </Text>
          <Switch
            value={isVisualMode}
            onValueChange={setVisualMode}
            color="#0052CC"
            accessibilityLabel={`${isVisualMode ? 'Visueller' : 'Taktiler'} Modus ist aktiv`}
            accessibilityHint="Doppeltippen zum Umschalten des Navigationsmodus"
          />
          <Text 
            style={[
              styles.modeText,
              isVisualMode && styles.activeText
            ]}
          >
            Visuell
          </Text>
        </View>
      </View>

      <View 
        style={[styles.switchContainer, styles.experimentalContainer]}
        accessible={true}
        accessibilityRole="switch"
        accessibilityLabel="WLAN Fingerprinting experimenteller Modus"
      >
        <Text 
          style={styles.switchLabel}
          accessibilityRole="header"
        >
          Experimentell
        </Text>
        <View 
          style={styles.switchRow}
          accessibilityHint="Aktiviert oder deaktiviert WLAN Fingerprinting zur Positionsbestimmung"
        >
          <Text style={styles.experimentalLabel}>
            WLAN Fingerprinting
          </Text>
          <Switch
            value={isWlanFingerprinting}
            onValueChange={setWlanFingerprinting}
            color="#0052CC"
            accessibilityLabel={`WLAN Fingerprinting ist ${isWlanFingerprinting ? 'aktiviert' : 'deaktiviert'}`}
            accessibilityHint="Doppeltippen zum Umschalten von WLAN Fingerprinting"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 32,
    color: '#000',
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderLabel: {
    fontSize: 28,
    marginBottom: 12,
    color: '#000',
  },
  slider: {
    marginTop: 8,
    width: '100%',
    height: 40,
  },
  switchContainer: {
    marginTop: 24,
  },
  experimentalContainer: {
    marginTop: 48,
  },
  switchLabel: {
    fontSize: 32,
    marginBottom: 12,
    color: '#000',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  modeText: {
    fontSize: 28,
    color: '#666',
  },
  experimentalLabel: {
    fontSize: 28,
    color: '#666',
  },
  activeText: {
    color: '#0052CC',
    fontWeight: '600',
  }
});

export default Settings;