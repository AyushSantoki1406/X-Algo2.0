import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreenComponent from "./app/SplashScreen";
import SignIn from "./app/Auth/SignIn";
import SignUp from "./app/Auth/SignUp";
import Dashboard from "./app/Screen/Home/Dashboard";
import ScanScreen from "./app/ScanScreen";
import BottomTabs from "./app/navigation/BottomTabs";
import OrderTabs from "./app/navigation/OrderTabs";
import StrategiesTabs from "./app/navigation/StrategiesTabs";
import { Provider } from "react-redux";
import { store, persistor } from "./components/store";
import ToastManager from "toastify-react-native";
import Toast from "react-native-toast-message";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import ActiveTrade from "./app/Screen/Order/ActiveTrade";
import LiveTrade from "./app/Screen/Order/LiveTrade";
import PaperTrade from "./app/Screen/PaperTrade/PaperTrade";
import Deployed from "./app/Screen/Strategies/Deployed";
import Marketplace from "./app/Screen/Strategies/Marketplace";
import Subscribed from "./app/Screen/Strategies/Subscribed";

const Stack = createStackNavigator();
if (__DEV__) {
  console.log("Running in Debug Mode");
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toast />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={SplashScreenComponent}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{
                headerShown: false,
                cardStyle: { paddingTop: 0 }, // Ensure no top padding
              }}
            />
            <Stack.Screen
              name="ScanScreen"
              component={ScanScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BottomTabs"
              component={BottomTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OrderTabs"
              component={OrderTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StrategiesTabs"
              component={StrategiesTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ActiveTrade"
              component={ActiveTrade}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LiveTrade"
              component={LiveTrade}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PaperTrade"
              component={PaperTrade}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Deployed"
              component={Deployed}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Marketplace"
              component={Marketplace}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Subscribed"
              component={Subscribed}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
