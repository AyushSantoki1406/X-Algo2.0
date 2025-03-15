import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Deployed from "../Screen/Strategies/Deployed";
import Subscribed from "../Screen/Strategies/Subscribed";
import Marketplace from "../Screen/Strategies/Marketplace";

const Tab = createMaterialTopTabNavigator();

const StrategiesTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Deployed" component={Deployed} />
      <Tab.Screen name="Subscribed" component={Subscribed} />
      <Tab.Screen name="Marketplace" component={Marketplace} />
    </Tab.Navigator>
  );
};

export default StrategiesTabs;
