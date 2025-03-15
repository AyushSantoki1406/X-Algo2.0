import { Text, View, Image } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { StackParamList } from "../types/navigation";
import Logo from "../assets/darklogo.png";
import { useSelector } from "react-redux";
import { RootState } from "../components/store";

export default function SplashScreenComponent() {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  // ✅ Call useSelector outside of useEffect
  const auth = useSelector((state: RootState) => state.account.auth);
  const email = useSelector((state: RootState) => state.email.email);

  useEffect(() => {
    const prepare = async () => {
      try {
        console.log("Value from:", auth);
        console.log("Value from:", email);

        if (auth) {
          navigation.navigate("BottomTabs", {
            screen: "Dashboard",
            params: { userEmail: email },
          });

        } else {
          console.log("Navigating to SignIn");
          navigation.navigate("SignIn");
        }
      } catch (e) {
        console.warn(`Error from splash screen: ${e}`);
      }
    };

    prepare();
  }, [auth, email]); // ✅ Add dependencies to useEffect

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a1a",
      }}
    >
      <Image
        source={Logo}
        style={{
          width: 100,
          aspectRatio: 1,
          resizeMode: "cover",
          height: "30%",
        }}
      />
      <Text>h</Text>
    </View>
  );
}
