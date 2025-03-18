// app/navigation/SlideMenu.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackParamList } from "../../types/navigation";

interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
  fadeAnim: Animated.Value;
}

const SlideMenu: React.FC<SlideMenuProps> = ({
  isOpen,
  onClose,
  slideAnim,
  fadeAnim,
}) => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const menuItems = [
    { name: "Dashboard", icon: "dashboard", screen: "Dashboard" },
    { name: "Orders", icon: "list-alt", screen: "Orders" },
    { name: "PaperTrade", icon: "trending-up", screen: "PaperTrade" },
    { name: "Strategies", icon: "settings", screen: "Strategies" },
    { name: "Profile", icon: "person", screen: "Profile" },
    { name: "Add Broker", icon: "add-business", screen: "Broker" },
    { name: "Sign Out", icon: "logout", screen: "SignIn" },
  ];

  const handleNavigation = (screen: keyof StackParamList) => {
    onClose();
    navigation.navigate(screen as any); // Type assertion to avoid TS errors
  };

  // Get the full screen width for precise animation
  const screenWidth = Dimensions.get("window").width;

  return (
    <>
      {/* Overlay with fade animation */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Slide-in Menu with adjusted styling */}
      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [-screenWidth, 0],
                  outputRange: [-screenWidth, 0], // Full slide off-screen
                  extrapolate: "clamp", // Prevent any overflow
                }),
              },
            ],
            shadowColor: "#000",
            shadowOffset: { width: -2, height: 2 }, // Shift shadow left to avoid edge
            shadowOpacity: isOpen ? 0.25 : 0, // Shadow only when open
            shadowRadius: 3.84,
            elevation: isOpen ? 5 : 0, // Elevation only when open
          },
        ]}
      >
        <View style={styles.gradientContainer}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderText}>Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={30} color="#000" />
            </TouchableOpacity>
          </View>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() =>
                handleNavigation(item.screen as keyof StackParamList)
              }
            >
              <Icon
                name={item.icon}
                size={24}
                color="#333"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "80%", // Relative width, adjust if needed
    height: "100%",
    zIndex: 1000,
    overflow: "hidden", // Clip any overflow
  },
  gradientContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Solid fallback color
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden", // Clip content overflow
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuIcon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
});

export default SlideMenu;
