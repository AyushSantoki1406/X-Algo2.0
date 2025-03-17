// app/navigation/BottomTabs.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Dashboard from "../Screen/Home/Dashboard";
import PaperTrade from "../Screen/PaperTrade/PaperTrade";
import OrderTabs from "./OrderTabs";
import StrategiesTabs from "./StrategiesTabs";
import SlideMenu from "./SlideMenu"; // Import the new SlideMenu component
import Icon from "react-native-vector-icons/MaterialIcons";
import { StackParamList } from "../../types/navigation";
import { Dimensions } from "react-native";

const Tab = createBottomTabNavigator();

interface CustomHeaderProps {
  title: string;
  onMenuPress: () => void; // Add prop to handle menu press
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, onMenuPress }) => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const handleScanPress = () => {
    navigation.navigate("ScanScreen");
  };

  return (
    <SafeAreaView style={styles.safeHeader}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onMenuPress}>
          <Icon name="menu" size={30} color="#000" style={styles.headerIcon} />
        </TouchableOpacity>
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
  const [menuOpen, setMenuOpen] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Function to toggle the menu with animations
  const toggleMenu = () => {
    if (menuOpen) {
      // Close the menu
      Animated.timing(slideAnim, {
        toValue: -screenWidth, // Full slide off-screen
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuOpen(false));
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Open the menu
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: () => (
            <CustomHeader title={route.name} onMenuPress={toggleMenu} />
          ),
          tabBarStyle: { backgroundColor: "#ffffff", borderTopWidth: 0 },
          tabBarActiveTintColor: "#fcd535",
          tabBarInactiveTintColor: "#888",
          swipeEnabled: false,
          tabBarIcon: ({ focused, color }) => {
            let iconName: string;

            if (route.name === "Dashboard") {
              iconName = "dashboard";
            } else if (route.name === "Orders") {
              iconName = "list-alt";
            } else if (route.name === "PaperTrade") {
              iconName = "trending-up";
            } else if (route.name === "Strategies") {
              iconName = "settings";
            } else {
              iconName = "help";
            }

            return <Icon name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Orders" component={OrderTabs} />
        <Tab.Screen name="PaperTrade" component={PaperTrade} />
        <Tab.Screen name="Strategies" component={StrategiesTabs} />
      </Tab.Navigator>

      {/* Render the SlideMenu with fade animation */}
      <SlideMenu
        isOpen={menuOpen}
        onClose={toggleMenu}
        slideAnim={slideAnim}
        fadeAnim={fadeAnim}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  safeHeader: {
    paddingTop: Platform.OS === "web" ? 0 : 40,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    elevation: 0,
    shadowOpacity: 0,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcon: {
    padding: 5,
  },
});
