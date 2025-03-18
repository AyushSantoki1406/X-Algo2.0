// app/Screen/Home/Dashboard.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductionUrl } from "../../../URL/url";
import {
  allClientData,
  brokerLogin,
  userSchemaRedux,
} from "../../../components/redux/action/action";
import { setXId } from "../../../components/redux/action/email_action";
import { RootState } from "../../../components/store";
import DashboardAngel from "./DashboardAngel"; // Import the new component

// Define the type for capital items
interface CapitalItem {
  net?: string | number;
  [key: string]: any;
}

// Define the type for clientdata items
interface ClientDataItem {
  userData?: { [key: string]: any };
  balances?: { result: { balance_inr: string | number }[] };
  [key: string]: any;
}

const Dashboard = ({ darkMode = false }) => {
  const dispatch = useDispatch();
  const Email = useSelector((state: RootState) => state.email.email);
  const XId = useSelector((state: RootState) => state.email.XId);
  const clientdata = useSelector(
    (state: RootState) => state.account.allClientData
  ) as ClientDataItem[];
  const brokerLogin1 = useSelector(
    (state: RootState) => state.account.brokerLogin
  );
  const userSchema = useSelector(
    (state: RootState) => state.account.userSchemaRedux
  );
  const brokerCount = userSchema ? userSchema.BrokerCount : 0;

  const [loader, setLoader] = useState(false);
  const [capital, setCapital] = useState<CapitalItem[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const url =
    process.env.NODE_ENV === "production" ? ProductionUrl : ProductionUrl;

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setXId(userSchema?.XalgoID));

        const profileData = await axios.post(`${url}/userinfo`, { Email });
        console.log("userinfo response:", profileData.data);
        dispatch(allClientData(profileData.data));
        setLoader(true);

        const dbschema = await axios.post(`${url}/dbSchema`, { Email });
        console.log("dbSchema response:", dbschema.data);

        if (userSchema?.BrokerCount) {
          dispatch(brokerLogin(true));
        } else {
          dispatch(brokerLogin(false));
        }
        console.log("brokerLogin1:", brokerLogin1);

        if (brokerLogin1) {
          const response = await axios.post(`${url}/addbroker`, {
            First: false,
            Email,
            userSchema,
          });
          console.log("addbroker response:", response.data);

          const a = response.data;
          const newCapital = a.map(
            (user: { userData: { data: CapitalItem } }) => user.userData.data
          );
          console.log("newCapital:", newCapital);
          setCapital(newCapital);
          dispatch(userSchemaRedux(dbschema.data));
        }

        setError(null);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
        if (error.response) {
          setError(
            `Server error: ${error.response.status} - ${error.response.data}`
          );
        } else if (error.request) {
          setError("Network error: Unable to reach the server.");
        } else {
          setError(`Error: ${error.message}`);
        }
      }
    };

    fetchData();
  }, []);

  // Memoize the sum calculation to avoid unnecessary recalculations
  const calculatedSum = useMemo(() => {
    let sum = 0;
    if (clientdata.length > 0 && capital.length > 0) {
      clientdata.forEach((item: ClientDataItem, index: number) => {
        if (index < capital.length) {
          let netValue = Number(capital[index]?.net ?? 0);
          let balanceValue = Number(
            item.balances?.result?.[0]?.balance_inr ?? 0
          );

          console.log(`Index: ${index}`);
          console.log(`capital[index]?.net:`, capital[index]?.net);
          console.log(`Converted netValue:`, netValue);
          console.log(
            `item.balances?.result[0]?.balance_inr:`,
            item.balances?.result?.[0]?.balance_inr
          );
          console.log(`Converted balanceValue:`, balanceValue);
          console.log(`item.userData exists:`, !!item.userData);

          if (item.userData) {
            sum += isNaN(netValue) ? 0 : netValue;
          } else {
            sum += isNaN(balanceValue) ? 0 : balanceValue;
          }
        }
      });
    } else {
      console.log("Skipping sum calculation: clientdata or capital is empty");
      console.log("clientdata:", clientdata);
      console.log("capital:", capital);
    }
    console.log(`Final Sum:`, sum);
    return sum;
  }, [clientdata, capital]);

  // Update totalBalance when calculatedSum changes
  useEffect(() => {
    setTotalBalance(calculatedSum);
  }, [calculatedSum]);

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
      <ScrollView>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerRow}>
            <View style={styles.headerColumn}>
              <View style={styles.headerItem}>
                <Text style={[styles.headerText, darkMode && styles.darkText]}>
                  P&L
                </Text>
                <Text style={[styles.headerValue, darkMode && styles.darkText]}>
                  ₹
                </Text>
              </View>
              <View style={styles.headerItem}>
                <Text style={[styles.headerText, darkMode && styles.darkText]}>
                  Capital
                </Text>
                <Text
                  style={[
                    styles.headerValue,
                    totalBalance < 0 ? styles.redText : styles.greenText,
                    darkMode && styles.darkText,
                  ]}
                >
                  ₹{totalBalance.toFixed(3)}
                </Text>
              </View>
            </View>
          </View>

          {/* Main Content */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, darkMode && styles.darkText]}>
                {error}
              </Text>
            </View>
          ) : loader ? (
            <DashboardAngel capital={capital} darkMode={darkMode} />
          ) : (
            <View style={styles.loaderContainer}>
              <ActivityIndicator
                size="large"
                color={darkMode ? "#fff" : "#000"}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    // paddingVertical: 12,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
    // borderRadius: 8,
    marginHorizontal: 10,
    // paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: "#ddd",
    padding: 16,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  headerColumn: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerItem: {
    marginLeft: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  headerValue: {
    fontSize: 16,
    color: "#000",
  },
  redText: {
    color: "red",
  },
  greenText: {
    color: "green",
  },
  darkText: {
    color: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default Dashboard;
