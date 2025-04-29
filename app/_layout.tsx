import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { TripsProvider } from "./trips/TripsContext";

export default function Layout() {
  const pathname = usePathname();
  const router = useRouter();

  redirectIfRootPath(pathname, router);

  return (
    <TripsProvider>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }} />
    </TripsProvider>
  );
}
function redirectIfRootPath(pathname: string, router: ReturnType<typeof useRouter>) {
  useEffect(() => {
    if (pathname === "/") {
      router.replace("/Login");
    }
  }, [pathname]);
}

