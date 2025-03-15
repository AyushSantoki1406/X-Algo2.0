import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Dashboard from "../Screen/Home/Dashboard";
import PaperTrade from "../Screen/PaperTrade/PaperTrade";
import OrderTabs from "./OrderTabs";
import StrategiesTabs from "./StrategiesTabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StackParamList } from "../../types/navigation";

const Tab = createBottomTabNavigator();

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp<StackParamList>>(); //  Use proper type

  const handleScanPress = () => {
    navigation.navigate("ScanScreen"); // Navigate to ScanScreen
  };

  return (
    <SafeAreaView style={styles.safeHeader}>
      <View style={styles.header}>
        <Icon name="menu" size={30} color="#000" style={styles.headerIcon} />
        <Text style={styles.headerText}>{title}</Text>
        <TouchableOpacity onPress={handleScanPress}>
          <Icon
            name="qr-code-scanner"
            size={30}
            color="#000"
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function BottomTabs() {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: () => <CustomHeader title={route.name} />,
          tabBarStyle: { backgroundColor: "#6200EE" },
          tabBarActiveTintColor: "#fff",
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Orders" component={OrderTabs} />
        <Tab.Screen name="PaperTrade" component={PaperTrade} />
        <Tab.Screen name="Strategies" component={StrategiesTabs} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  safeHeader: {
    paddingTop: 40, // Ensures space for the status bar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    elevation: 3,
    shadowOpacity: 0.2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcon: {
    padding: 5,
  },
});
