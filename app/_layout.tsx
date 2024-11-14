import { Stack } from "expo-router";

import { MyContextProvider } from "./Context";

export default function RootLayout() {
  return (
    <MyContextProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="mainmenu" />
        <Stack.Screen name="credits"  />
        <Stack.Screen name="register" />
        <Stack.Screen name="changeProfilePic" />
        <Stack.Screen name="cameraTry" />

      </Stack>
    </MyContextProvider>
    
  );
}