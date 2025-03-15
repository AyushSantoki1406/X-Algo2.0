export type StackParamList = {
  Splash: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ScanScreen: undefined;
  BottomTabs: { screen: string; params?: any };
  // BottomTabs: undefined;
  OrderTabs: undefined;
  StrategiesTabs: undefined;
  Dashboard: { userEmail: string }; // Add this line
};
