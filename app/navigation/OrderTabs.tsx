import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LiveTrade from "../Screen/Order/LiveTrade";
import ActiveTrade from "../Screen/Order/ActiveTrade";

const Tab = createMaterialTopTabNavigator();

const OrderTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Live Trade" component={LiveTrade} />
      <Tab.Screen name="Active Trade" component={ActiveTrade} />
    </Tab.Navigator>
  );
};

export default OrderTabs;
