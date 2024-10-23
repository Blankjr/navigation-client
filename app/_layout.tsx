import { DarkTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { MD3LightTheme, DefaultTheme, PaperProvider, configureFonts } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';

// Define font configuration for better readability
const fontConfig = {
  fontFamily: 'System',
  displayLarge: {
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 40,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 36,
  },
  displaySmall: {
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 32,
  },
  headlineLarge: {
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelLarge: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
};

// Define accessible color scheme
// These colors meet WCAG 2.1 AA standards for contrast
const accessibleColors = {
  primary: '#0052CC', // Accessible blue with good contrast
  primaryContainer: '#E6F0FF',
  secondary: '#2C5282', // Darker blue for secondary actions
  secondaryContainer: '#EDF2FF',
  error: '#D32F2F', // Error red
  errorContainer: '#FFEBEE',
  background: '#FFFFFF',
  surface: '#F5F6F7',
  surfaceVariant: '#F0F4F8',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#0052CC',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#2C5282',
  onError: '#FFFFFF',
  onErrorContainer: '#D32F2F',
  onBackground: '#1A1A1A',
  onSurface: '#1A1A1A',
  onSurfaceVariant: '#4A5568',
  outline: '#718096',
  elevation: {
    level0: 'transparent',
    level1: '#F7FAFC',
    level2: '#EDF2F7',
    level3: '#E2E8F0',
    level4: '#CBD5E0',
    level5: '#A0AEC0',
  },
};

// Create accessible theme
const accessibleTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({config: fontConfig}),
  colors: {
    ...MD3LightTheme.colors,
    ...accessibleColors,
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};

// Add custom properties for spacing consistency
const themeSpacing = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

const theme = {
  ...accessibleTheme,
  ...themeSpacing,
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
      <StatusBar 
          style={isDarkMode ? 'light' : 'dark'}
          backgroundColor={isDarkMode ? 'rgba(0,0,0,0.8)' : '#FFFFFF'}
        />
        <SafeAreaView 
          style={{ 
            flex: 1, 
            backgroundColor: theme.colors.background 
          }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { 
                backgroundColor: theme.colors.background 
              },
            }}
          >
            <Stack.Screen name="index" />
          </Stack>
        </SafeAreaView>
      </PaperProvider>
    </QueryClientProvider>
  );
}