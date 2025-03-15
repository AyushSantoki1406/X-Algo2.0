import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Material Icons
import { useNavigation, NavigationProp } from "@react-navigation/native"; // Import NavigationProp
import { StackParamList } from "../../../types/navigation";

const Dashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp<StackParamList>>(); //  Use proper type

  const handleScanPress = () => {
    navigation.navigate("ScanScreen"); // Navigate to ScanScreen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text>fghjk</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  headerIcon: {},
  content: {
    padding: 15,
  },
});

export default Dashboard;
