import { DarkTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue', // Color of the selected tab icon and text
    accent: 'red', // Color of the navigation bar background
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={customTheme}>
      <StatusBar style="dark" backgroundColor="rgba(0,0,0,0.1)" />
      <SafeAreaView style={{ flex: 1, backgroundColor: customTheme.colors.background }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: customTheme.colors.background },
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </SafeAreaView>
    </PaperProvider>
  );
}
