import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Index from "./index";
import login from "./login";
import register from "./register";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen
        name="index"
        component={Index}
        options={{ title: "index Page" }}
      />
      <Stack.Screen
        name="login"
        component={login}
        options={{ title: "Login Page" }}
      />
      <Stack.Screen
        name="register"
        component={register}
        options={{ title: "Register Page" }}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
}
