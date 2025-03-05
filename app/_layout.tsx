import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function Layout() {
  const pathname = usePathname();
  const router = useRouter();

  redirectIfRootPath(pathname, router);

  return (
    <>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
function redirectIfRootPath(pathname: string, router: ReturnType<typeof useRouter>) {
  useEffect(() => {
    if (pathname === "/") {
      router.replace("/Login");
    }
  }, [pathname]);
}

