import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      <StatusBar hidden /> {/* Hides the status bar */}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
