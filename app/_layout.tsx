import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AlertProvider } from '../context/AlertContext';

export default function Layout() {
  const pathname = usePathname();
  const router = useRouter();

  redirectIfRootPath(pathname, router);

  return (
    <AlertProvider>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }} />
    </AlertProvider>
  );
}
function redirectIfRootPath(pathname: string, router: ReturnType<typeof useRouter>) {
  useEffect(() => {
    if (pathname === "/") {
      router.replace("/pantalla-inicial");
    }
  }, [pathname]);
}