import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function Layout() {
  const pathname = usePathname();
  const router = useRouter();

  
  return (
    <>
      <StatusBar hidden /> 
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
