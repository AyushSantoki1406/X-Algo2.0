import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LiveTrade from "../Screen/Order/LiveTrade";
import ActiveTrade from "../Screen/Order/ActiveTrade";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Material Icons

const Tab = createMaterialTopTabNavigator();

const OrderTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        swipeEnabled: false, // Disable swipe navigation
        tabBarIcon: ({ focused, color }) => {
          let iconName: string;

          // Assign icons based on the route name
          if (route.name === "Live Trade") {
            iconName = "play-arrow"; // Icon for Live Trade
          } else if (route.name === "Active Trade") {
            iconName = "toggle-on"; // Icon for Active Trade
          } else {
            iconName = "help"; // Default fallback icon
          }

          // Return the icon component
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
        tabBarActiveTintColor: "#fcd535",
        tabBarInactiveTintColor: "#888",
      })}
    >
      <Tab.Screen name="Live Trade" component={LiveTrade} />
      <Tab.Screen name="Active Trade" component={ActiveTrade} />
    </Tab.Navigator>
  );
};

export default OrderTabs;
