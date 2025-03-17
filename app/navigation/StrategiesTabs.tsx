import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Deployed from "../Screen/Strategies/Deployed";
import Subscribed from "../Screen/Strategies/Subscribed";
import Marketplace from "../Screen/Strategies/Marketplace";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createMaterialTopTabNavigator();

const StrategiesTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#fcd535",
        tabBarInactiveTintColor: "#888",
        swipeEnabled: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName: string;

          if (route.name === "Deployed") {
            iconName = "rocket-launch";
          } else if (route.name === "Subscribed") {
            iconName = "subscriptions";
          } else if (route.name === "Marketplace") {
            iconName = "store";
          } else {
            iconName = "help";
          }

          return <Icon name={iconName} size={20} color={color} />;
        },
        tabBarShowIcon: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: "#fff",
          borderBottomWidth: 0,
        },
        tabBarItemStyle: {
          borderBottomWidth: 0,
          outline: "none",
        },
        tabBarIndicatorStyle: {
          height: 0, // Remove the active tab indicator
          backgroundColor: "transparent",
        },
      })}
    >
      <Tab.Screen name="Deployed" component={Deployed} />
      <Tab.Screen name="Subscribed" component={Subscribed} />
      <Tab.Screen name="Marketplace" component={Marketplace} />
    </Tab.Navigator>
  );
};

export default StrategiesTabs;
