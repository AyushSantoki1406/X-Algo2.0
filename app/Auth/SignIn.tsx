import axios from "axios";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
// import { allClientData, auth, userSchemaRedux } from "../../actions/actions";
// import { setEmail } from "../../actions/email_action";
import { ProductionUrl } from "../../URL/url";
import { toast } from "react-toastify";
// import { RootState } from "../../store/configureStore";
import { useNavigation, NavigationProp } from "@react-navigation/native"; // Import NavigationProp
import { StackParamList } from "../../types/navigation";
import { setEmail, setXId } from "../../components/redux/action/email_action";
import { Store } from "redux";
import { RootState } from "../../components/store";
const { height, width } = Dimensions.get("window"); // Get full screen height
import StepIndicator from "react-native-step-indicator";
import { Button } from "react-native";
import { GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
import { TextInputKeyPressEventData } from "react-native";
import { NativeSyntheticEvent } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import Toast from "react-native-toast-message";
import {
  allClientData,
  auth,
  userSchemaRedux,
} from "../../components/redux/action/action";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

export default function SignIn() {
  const [aniLoading, setAniLoading] = useState(true);
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useState("");
  const [pass, passInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [pin, setPin] = useState("");
  const [realOtp, setRealOtp] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const navigation = useNavigation<NavigationProp<StackParamList>>(); //  Use proper type
  const [timer, setTimer] = useState(0); // Initialize the timer state
  const [isInvalidOtp, setIsInvalidOtp] = useState(false);

  const isAuth = useSelector((state: RootState) => state.account ?? false);
  console.log(isAuth);

  // const user = useSelector((state: RootState) => state.email);
  // console.log(user);

  const [otp, setOtp] = useState(Array(6).fill(""));

  const url = "https://seahorse-app-csyn9.ondigitalocean.app";

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       const response = await axios.get(`${url}/check-session`, {
  //         withCredentials: true,
  //       });
  //       console.log(response.data);
  //       if (response.data.activeSession) {
  //         setIsSessionActive(true);
  //         console.log(isSessionActive);
  //         setUserInput(response.data.user.clientId);
  //       }
  //     } catch (error) {
  //       console.error("Error checking session:", error);
  //     }
  //   };

  //   checkSession();
  // }, [navigate, url]);

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // if (index < 5) {
      //   // Automatically focus next input
      //   otpInputs[index + 1]?.focus();
      // }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      // if (index > 0) {
      //   otpInputs[index - 1]?.focus();
      // }
    }
  };

  const handleProceed = async (resend: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/signin-step-1`, {
        userInput,
      });
      if (response.data.canSendOtp) {
        setStep(1);
        const otpResponse = await axios.post(`${url}/signin-step-2`);
        if (otpResponse.data.otp) {
          console.log("==================>", otpResponse.data.otp);
          console.log("Showing success toast...");
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "This is a success message!",
          });

          setRealOtp(otpResponse.data.otp);
        }
      }
    } catch (error) {
      console.error("Proceed error: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred during proceed!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleotp = () => {
    console.log(otp);
    console.log(typeof otp);
    console.log(realOtp);
    console.log(typeof realOtp);
    if (realOtp === (Array.isArray(otp) ? otp.join("") : otp)) {
      toast.success("Proceed successful!", {
        position: "top-center",
        autoClose: 2000,
      });

      setStep(2);
    } else {
      Toast.show({
        type: "error",
        text2: "OTP is wrong!",
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const deviceInfo = Device.modelName;
      console.log(userInput);

      const response = await axios.post(`${url}/verify-pin`, {
        userInput,
        deviceInfo,
        pin,
      });

      console.log(
        ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> verify pin response       ",
        response.data
      );
      if (response.data.pin) {
        const Email = response.data.userSchema.Email;

        // Send login mail
        await axios.post(`${url}/sendLoginMail`, { Email, deviceInfo });

        // Fetch user info
        const profileData = await axios.post(`${url}/userinfo`, { Email });
        await AsyncStorage.setItem("isLoggedIn", "true");
        dispatch(allClientData(profileData.data));
        console.log(profileData.data);
        dispatch(setEmail(Email));
        dispatch(auth(true));
        dispatch(userSchemaRedux(response.data.userSchema));
        console.log(response.data.userSchema);
        dispatch(setXId(response.data.userSchema.XalgoID));
        console.log(response.data.userSchema.XalgoID);

        // Navigate to Dashboard
        navigation.navigate("Dashboard", { userEmail: Email });
      } else {
        Toast.show({
          type: "error",
          text1: "Wrong PIN!",
          position: "top",
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      // setLoading(true);
      setAniLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup the interval on component unmount or when timer changes
    }
  }, [timer]);

  const resendOTP = () => {
    if (timer === 0) {
      // Trigger your resend OTP logic here
      console.log("OTP Resent");
      handleProceed(true);
      setTimer(30); // Start the 30-second timer
    }
  };
  const [animation, setAnimation] = useState("");
  const handleNextStep = () => {
    setAnimation("slide-out-left");
    setTimeout(() => {
      // setStep(step + 1);
      setAnimation("slide-in-right");
    }, 300); // Match animation duration
  };

  const handlePreviousStep = () => {
    setAnimation("slide-out-right");
    setTimeout(() => {
      setStep(step - 1);
      setAnimation("slide-in-left");
    }, 500); // Match animation duration
  };

  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 3,
    stepStrokeCurrentColor: "#fcd535",
    stepStrokeWidth: 2,
    stepStrokeFinishedColor: "#fcd535",
    stepStrokeFinishedWidth: 80,
    stepStrokeUnFinishedColor: "#fcd535",
    separatorFinishedColor: "#fcd535",
    separatorUnFinishedColor: "#ffffff",
    stepIndicatorFinishedColor: "#fcd535",
    stepIndicatorUnFinishedColor: "#1a1a1a",
    stepIndicatorCurrentColor: "#fcd535",
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 15,
    stepIndicatorLabelCurrentColor: "#000",
    stepIndicatorLabelFinishedColor: "#000",
    stepIndicatorLabelUnFinishedColor: "#FFFFFF",
    animationDuration: 10000,
  };
  return (
    <SafeAreaView style={styles.container}>
      <Toast />
      <ScrollView keyboardShouldPersistTaps="handled" style={{ width: "100%" }}>
        <View style={styles.signinContainer}>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={step}
            stepCount={3}
          />
          <View style={styles.stepContent}>
            {step === 0 && (
              <>
                <View
                  style={{
                    alignItems: "flex-start",
                    width: "100%",
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "700",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Welcome to X-Algos! 👋
                  </Text>
                  <Text style={styles.ranpq}>
                    Please sign up to create a new account
                  </Text>
                  <Text style={styles.signinLabel}>
                    Client ID or Mobile Number
                  </Text>
                  <TextInput
                    style={styles.signinInput}
                    maxLength={10}
                    placeholder="Enter Client Id or Mobile No"
                    placeholderTextColor="#888"
                    value={userInput}
                    onChangeText={setUserInput}
                  />
                </View>

                <View style={{ width: "100%", marginTop: 40 }}>
                  <TouchableOpacity
                    style={[
                      styles.signinLoginButton,
                      loading && styles.disabledButton,
                    ]}
                    onPress={(e) => handleProceed(false)}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.buttonText}>Proceed</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.signinSignup}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    <Text style={{ textAlign: "center", color: "white" }}>
                      New on our platform?
                      <Text style={styles.signupLink}> Create an account</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {step === 1 && (
              <>
                <View
                  style={{
                    alignItems: "flex-start",
                    width: "100%",
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "700",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Welcome to X-Algos! 👋
                  </Text>
                  <Text style={styles.ranpq}>
                    Please sign up to create a new account
                  </Text>
                  <Text style={styles.signinLabel2}>
                    Verify your Mobile OTP
                  </Text>
                  <Text style={styles.signinLabel}>Mobile OTP</Text>
                  <OtpInput
                    numberOfDigits={6}
                    focusColor="#fcd535"
                    autoFocus={false}
                    hideStick={true}
                    blurOnFilled={true}
                    disabled={false}
                    type="numeric"
                    secureTextEntry={false}
                    focusStickBlinkingDuration={500}
                    onFocus={() => console.log("Focused")}
                    onBlur={() => console.log("Blurred")}
                    onTextChange={(text: any) => setOtp(text)}
                    onFilled={(text: any) => console.log(`OTP is ${text}`)}
                    textInputProps={{
                      accessibilityLabel: "One-Time Password",
                    }}
                    theme={{
                      containerStyle: { marginTop: 5 },
                      inputsContainerStyle: {},
                      pinCodeTextStyle: {
                        color: isInvalidOtp ? "red" : "white",
                        fontSize: 20,
                      },
                    }}
                  />
                  <Text style={{ color: "green" }}>{realOtp}</Text>
                </View>

                <View style={{ width: "100%", marginTop: 10 }}>
                  <TouchableOpacity
                    style={[
                      styles.signinLoginButton,
                      loading && styles.disabledButton,
                    ]}
                    onPress={handleotp}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.buttonText}>Next</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={{ width: "100%", marginTop: 10 }}>
                  <TouchableOpacity
                    style={[
                      styles.signinLoginButton,
                      loading && styles.disabledButton,
                    ]}
                    onPress={handlePreviousStep}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.buttonText}>Back</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: "100%",
                    alignItems: "flex-end",
                    paddingRight: 10,
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    <Text style={[styles.signupLink, { textAlign: "right" }]}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <View
                  style={{
                    alignItems: "flex-start",
                    width: "100%",
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "700",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Welcome to X-Algos! 👋
                  </Text>
                  <Text style={styles.ranpq}>
                    Please sign up to create a new account
                  </Text>
                  <Text style={styles.signinLabel3}>PIN</Text>
                  <TextInput
                    style={styles.signinInput2}
                    maxLength={4}
                    placeholder="Enter PIN"
                    placeholderTextColor="#888"
                    value={pin}
                    onChangeText={setPin}
                    keyboardType="numeric"
                  />
                </View>

                <View style={{ width: "100%", marginTop: 40 }}>
                  <TouchableOpacity
                    style={[
                      styles.signinLoginButton,
                      loading && styles.disabledButton,
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.buttonText}>Submit</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    // justifyContent: "center",
    alignItems: "center",
  },
  signinContainer: {
    justifyContent: "center",
    alignSelf: "center",
    width: "85%",
    marginVertical: 0,
    // marginHorizontal: 20,
    borderRadius: 10, // Optional: For rounded corners
    // width: width,
    marginTop: 70,
  },

  stepContent: {
    alignItems: "center",
    marginTop: 25,
    height: "50%",
  },
  text: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  ranpq: {
    marginTop: 5,
    marginBottom: 24, // 1.5em ≈ 24px
    color: "#b0b3c7",
    fontSize: 16, // 1em ≈ 16px in React Native
  },
  buttonContainer: {
    marginHorizontal: 16, // Adds space on both sides
  },
  signinInput: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3b3e57",
    backgroundColor: "transparent",
    color: "#ffffff",
    fontSize: 14,
    // marginBottom: 5,
    marginTop: 0,
    height: "30%",
  },
  signinInput2: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3b3e57",
    backgroundColor: "transparent",
    color: "#ffffff",
    fontSize: 14,
    // marginBottom: 5,
    marginTop: 0,
    height: "35%",
  },
  signinLabel: {
    fontSize: 14, // Approximate to 0.9em
    color: "#b0b3c7",
    marginBottom: 5, // Approximate to 0.3em
    textAlign: "left", // Align text to the left
    alignSelf: "flex-start",
    marginTop: 25,
  },
  signinLabel3: {
    fontSize: 14, // Approximate to 0.9em
    color: "#b0b3c7",
    marginBottom: 5, // Approximate to 0.3em
    textAlign: "left", // Align text to the left
    alignSelf: "flex-start",
    marginTop: 10,
  },
  signinLabel2: {
    fontSize: 18, // Approximate to 0.9em
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: 5, // Approximate to 0.3em
    textAlign: "left", // Align text to the left
    alignSelf: "flex-start",
    // marginTop: 25,
  },
  signinLoginButton: {
    // marginVertical: 8,
    backgroundColor: "#fcd535",
    borderRadius: 8,
    marginTop: 0,
    paddingVertical: 12,
    // paddingHorizontal: 20,
    alignItems: "center",
    width: "100%", // Adjust width instead of full screen
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingSpinner: {
    margin: 5,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  signinSignup: {
    color: "#b0b3c7",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  signupLink: {
    color: "#fcd535",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  // otpinputcontainer: {
  //   display: "flex", // Default in React Native, can be omitted
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginVertical: 20, // `margin: 20px 0` in React Native
  // },
});
