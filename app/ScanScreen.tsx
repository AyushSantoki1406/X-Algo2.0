import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for back icon
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../components/store";
import { StackParamList } from "../types/navigation";
import { socket } from "../URL/socket";
function ScanScreen() {
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const email = useSelector((state: RootState) => state.email.email);
  const userSchemaRedux = useSelector(
    (state: RootState) => state.account.userSchemaRedux
  );
  const XId = useSelector((state: RootState) => state.email.XId);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!scanned) {
      socket.on("connect", () => {
        console.log("Connected to server");
      });

      setScanned(true);
      console.log("Scanned QR Code:", result.data);

      socket.emit("mobileLogin", {
        qrToken: result.data,
        clientId: XId,
        pin: userSchemaRedux.ClientPin,
      });

      socket.on(
        "mobileLoginResponse",
        (response: { success: any; sessionToken: string; message: string }) => {
          console.log("📩 Response from server:", response);

          if (response.success) {
            alert("✅ Login Successful: " + response.sessionToken);
            navigation.navigate("BottomTabs", {
              screen: "Dashboard",
              params: { userEmail: email },
            });
          } else {
            alert("❌ Login Failed: " + response.message);
          }
        }
      );

      socket.emit("msg");
      return () => {
        socket.off("mobileLoginResponse"); // Clean up listener
      };
    }
  };

  if (!hasPermission) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (!hasPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to access the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("BottomTabs", {
              screen: "Dashboard",
              params: { userEmail: email },
            })
          }
        >
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR-code</Text>
      </View>

      {/* QR Frame Guide */}
      <View style={styles.qrFrame}>
        <Text style={styles.qrInstruction}>
          Place QR code within the frame to scan
        </Text>
      </View>

      {/* Scan Again Button */}
      {scanned && (
        <TouchableOpacity
          style={styles.scanAgainButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanAgainText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  permissionButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  permissionText: {
    color: "white",
    fontSize: 16,
  },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.0)",
    height: 60,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  qrFrame: {
    position: "absolute",
    alignSelf: "center",
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    top: "35%",
  },
  qrInstruction: {
    position: "absolute",
    marginTop: 80,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    bottom: -45,
  },
  scanAgainButton: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  scanAgainText: {
    color: "white",
    fontSize: 16,
  },
});
