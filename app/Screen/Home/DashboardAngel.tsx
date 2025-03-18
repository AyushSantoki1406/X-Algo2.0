// app/Screen/Home/components/DashboardAngel.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ProductionUrl } from "../../../URL/url";
import { RootState } from "../../../components/store";
import MultiCalendar from "./MultiCalendar";

interface CapitalItem {
  net?: string | number;
  [key: string]: any;
}

interface ClientDataItem {
  userData?: { data: { clientcode: string; name: string }; [key: string]: any };
  balances?: { result: { balance_inr: string | number; user_id: string }[] };
  userDetails?: { result: { first_name?: string; last_name?: string } };
  [key: string]: any;
}

interface DashboardAngelProps {
  capital: CapitalItem[];
  darkMode: boolean;
}

const DashboardAngel: React.FC<DashboardAngelProps> = ({
  capital,
  darkMode,
}) => {
  const brokerInfo = useSelector(
    (state: RootState) => state.account.allClientData
  ) as ClientDataItem[];
  const userSchema = useSelector(
    (state: RootState) => state.account.userSchemaRedux
  );
  const email = useSelector((state: RootState) => state.email.email);

  const [isExpanded, setIsExpanded] = useState(false);
  const [allSheetData, setAllSheetData] = useState<any[]>([]);
  const [updatedAllSheetData, setUpdatedAllSheetData] = useState<
    any[] | undefined
  >(undefined);
  const [selectedStrategies, setSelectedStrategies] = useState<{
    [key: string]: string;
  }>({});
  const [clientStrategyMap, setClientStrategyMap] = useState<{
    [key: string]: string[];
  }>({});
  const [loader, setLoader] = useState(false);

  const ids =
    userSchema?.DeployedData?.filter(
      (data: any) => data.Broker === "paperTrade"
    ).map((data: any) => data.Strategy) || [];

  const url = ProductionUrl;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleStrategyChange = (clientId: string, strategy: string) => {
    setSelectedStrategies((prev) => ({ ...prev, [clientId]: strategy }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        const response = await axios.post(`${url}/getMarketPlaceData`, {
          email,
        });
        const jsonData = response.data.allData;

        const filteredData = jsonData.filter((item: any) =>
          ids.includes(item._id)
        );
        const mergedData = filteredData.map((strategy: any) => {
          const deployedInfo = userSchema?.DeployedData?.find(
            (data: any) => data.Strategy.toString() === strategy._id.toString()
          );
          return {
            ...strategy,
            AppliedDate: deployedInfo ? deployedInfo.AppliedDate : "N/A",
            Index: deployedInfo ? deployedInfo.Index : "N/A",
          };
        });

        const response3 = await axios.post(`${url}/fetchAllSheetData`, {
          email,
        });
        setAllSheetData(response3.data.allSheetData);

        if (response3.data.allSheetData.length > 0) {
          const updatedSheetData = response3.data.allSheetData.map(
            (sheet: any) => {
              const pnlByDate: { [key: string]: number } = {};
              const monthlyMetrics: { [key: string]: any } = {};
              let totalTrades = 0;
              let successfulTrades = 0;
              let totalInvestment = 0;
              let totalProfit = 0;

              if (
                sheet.sheetData &&
                Array.isArray(sheet.sheetData) &&
                sheet.sheetData.length > 0
              ) {
                sheet.sheetData.forEach((trade: any) => {
                  const date = trade[3];
                  const pnl = parseFloat(trade[10]);
                  const investment = parseFloat(trade[5]);

                  if (date && !isNaN(pnl)) {
                    const tradeDate = new Date(date);
                    const month = `${tradeDate.getFullYear()}-${
                      tradeDate.getMonth() + 1
                    }`;

                    pnlByDate[date] = (pnlByDate[date] || 0) + pnl;

                    monthlyMetrics[month] = monthlyMetrics[month] || {
                      totalTrades: 0,
                      successfulTrades: 0,
                      totalInvestment: 0,
                      totalProfit: 0,
                    };

                    monthlyMetrics[month].totalTrades++;
                    if (pnl > 0) monthlyMetrics[month].successfulTrades++;
                    if (!isNaN(investment) && investment > 0) {
                      monthlyMetrics[month].totalInvestment += investment;
                      monthlyMetrics[month].totalProfit += pnl;
                    }

                    totalTrades++;
                    if (pnl > 0) successfulTrades++;
                    if (!isNaN(investment) && investment > 0) {
                      totalInvestment += investment;
                      totalProfit += pnl;
                    }
                  }
                });
              }

              const tradeAccuracy =
                totalTrades > 0 ? (successfulTrades / totalTrades) * 100 : 0;
              const rio =
                totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

              const monthlyAccuracy: { [key: string]: string } = {};
              const monthlyRoi: { [key: string]: string } = {};
              Object.keys(monthlyMetrics).forEach((month) => {
                const metrics = monthlyMetrics[month];
                const accuracy =
                  metrics.totalTrades > 0
                    ? (metrics.successfulTrades / metrics.totalTrades) * 100
                    : 0;
                const roi =
                  metrics.totalInvestment > 0
                    ? (metrics.totalProfit / metrics.totalInvestment) * 100
                    : 0;
                monthlyAccuracy[month] = accuracy.toFixed(2);
                monthlyRoi[month] = roi.toFixed(2);
              });

              return {
                ...sheet,
                pnlByDate,
                tradeAccuracy: tradeAccuracy.toFixed(2),
                rio: rio.toFixed(2),
                monthlyAccuracy,
                monthlyRoi,
              };
            }
          );

          setUpdatedAllSheetData(updatedSheetData);

          const strategyMap: { [key: string]: Set<string> } = {};
          updatedSheetData.forEach((item: any) => {
            strategyMap[item.UserId] = strategyMap[item.UserId] || new Set();
            strategyMap[item.UserId].add(item.strategyName);
          });

          const strategyMapWithArrays: { [key: string]: string[] } = {};
          Object.keys(strategyMap).forEach((key) => {
            strategyMapWithArrays[key] = Array.from(strategyMap[key]);
          });
          setClientStrategyMap(strategyMapWithArrays);
        }
      } catch (error) {
        console.error("Error fetching sheet data:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView
      style={[styles.container, styles.deskbordContainer]}
      contentContainerStyle={styles.scrollContentContainer}
    >
      {brokerInfo.map((item, index) => {
        const clientId =
          item?.userData?.data?.clientcode ||
          item?.balances?.result[0]?.user_id?.toString() ||
          "";

        return (
          <View
            key={index}
            style={[
              styles.statsContainer,
              styles.statsCard,
              darkMode && styles.vgjsdbhcd,
            ]}
          >
            <View style={styles.dropdownContent}>
              <View style={styles.accountItem}>
                <Text style={[styles.label, darkMode && styles.darkText]}>
                  Account name:
                </Text>
                <Text style={[styles.value, darkMode && styles.darkText]}>
                  {userSchema?.AccountAliases?.[clientId] || "N/A"}
                </Text>
              </View>
              <View style={styles.accountItem}>
                <Text style={[styles.label, darkMode && styles.darkText]}>
                  Name:
                </Text>
                <Text
                  style={[styles.value, darkMode && styles.darkText]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.userData?.data.name ||
                    `${item.userDetails?.result?.first_name ?? ""} ${
                      item.userDetails?.result?.last_name ?? ""
                    }`.trim() ||
                    "N/A"}
                </Text>
              </View>
              <View style={styles.accountItem}>
                <Text style={[styles.label, darkMode && styles.darkText]}>
                  Broker:
                </Text>
                <Text style={[styles.value, darkMode && styles.darkText]}>
                  {item.userData
                    ? "Angel One"
                    : item.userDetails
                    ? "Delta"
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.accountItem}>
                <Text style={[styles.label, darkMode && styles.darkText]}>
                  Active Strategy:
                </Text>
                <Text style={[styles.value, darkMode && styles.darkText]}>
                  {userSchema?.ActiveStrategys || "N/A"}
                </Text>
              </View>
            </View>

            <View style={[styles.statsCard, darkMode && styles.cdaacceecaec]}>
              <View style={[styles.statsRow]}>
                <View style={styles.statItem}>
                  <Text style={[styles.label, darkMode && styles.darkText]}>
                    Account Balance
                  </Text>
                  {item.userData ? (
                    capital.map(
                      (cap, index1) =>
                        index === index1 && (
                          <Text
                            key={index1}
                            style={[
                              styles.value,
                              Number(cap.net) < 0 ? styles.red : styles.green,
                              darkMode && styles.darkText,
                            ]}
                          >
                            ₹{cap.net || "0"}
                          </Text>
                        )
                    )
                  ) : (
                    <Text
                      style={[
                        styles.value,
                        Number(item?.balances?.result[0]?.balance_inr) < 0
                          ? styles.red
                          : styles.green,
                        darkMode && styles.darkText,
                      ]}
                    >
                      ₹{item?.balances?.result[0]?.balance_inr || "0"}
                    </Text>
                  )}
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.label, darkMode && styles.darkText]}>
                    Overall gain
                  </Text>
                  <Text style={[styles.value, darkMode && styles.darkText]}>
                    0
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.label, darkMode && styles.darkText]}>
                    Monthly gain
                  </Text>
                  <Text
                    style={[
                      styles.value,
                      styles.green,
                      darkMode && styles.darkText,
                    ]}
                  >
                    0%
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.label, darkMode && styles.darkText]}>
                    Today's gain
                  </Text>
                  <Text
                    style={[
                      styles.value,
                      styles.green,
                      darkMode && styles.darkText,
                    ]}
                  >
                    0%
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {loader ? (
                <ActivityIndicator
                  size="small"
                  color={darkMode ? "#fff" : "#000"}
                />
              ) : (
                <View style={[styles.strategySelector]}>
                  <Picker
                    selectedValue={
                      selectedStrategies[clientId] || "Select Strategy"
                    }
                    onValueChange={(value: string) =>
                      handleStrategyChange(clientId, value)
                    }
                    style={[styles.picker, darkMode && styles.darkPicker]}
                  >
                    <Picker.Item
                      label="Select Strategy"
                      value="Select Strategy"
                    />
                    {(clientStrategyMap[clientId] || []).map(
                      (strategy, index) => (
                        <Picker.Item
                          key={index}
                          label={strategy}
                          value={strategy}
                        />
                      )
                    )}
                  </Picker>
                </View>
              )}

              {allSheetData
                .filter(
                  (sheet) =>
                    sheet.UserId === clientId &&
                    sheet.strategyName === selectedStrategies[clientId]
                )
                .map((filteredSheet, index2) => (
                  <View key={index2} style={styles.sheetItem}>
                    <MultiCalendar
                      index2={index2}
                      allSheetData={allSheetData}
                      selectedStrategy={selectedStrategies[clientId]}
                      clientId={filteredSheet.UserId}
                      darkMode={darkMode}
                      updatedAllSheetData={updatedAllSheetData || []}
                    />
                  </View>
                ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const { width } = Dimensions.get("window");
const isSmallScreen = width <= 480;
const isMobile = width <= 876;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  deskbordContainer: {
    flexDirection: "column",
    paddingHorizontal: 10,
  },
  scrollContentContainer: {
    paddingBottom: 20, // Add padding to ensure content isn't cut off at the bottom
  },
  statsContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderRadius: 8,
    marginTop: isSmallScreen ? 10 : 10,
    ...(isSmallScreen && {
      marginLeft: 1.6,
      marginRight: 1.6,
    }),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountInfo: {
    borderRadius: 16,
    shadowColor: "#3C4043",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  dropdownContent: {
    padding: 10,
  },
  accountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  statsCard: {
    padding: 16,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 16,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "flex-end",
  },
  statItem: {
    width: "48%",
    marginVertical: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  strategySection: {
    marginTop: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  strategySelector: {
    // marginBottom: 10,
    // borderRadius: 16,
    // shadowColor: "#3C4043",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.3,
    // shadowRadius: 2,
    // elevation: 2,
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10, // Moved inline margin here
    borderWidth: 0, // Remove all borders
    borderBottomWidth: 2, // Add bottom border
    borderBottomColor: "#ccc", // Light gray bottom border
    fontSize: 16,
  },
  picker: {
    height: 40,
    width: "100%",
    color: "#000",
    backgroundColor: "#fff",
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  darkPicker: {
    color: "#fff",
    backgroundColor: "#333",
    borderBottomColor: "#666",
  },
  sheetItem: {
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    color: "#000",
  },
  redText: {
    color: "red",
  },
  greenText: {
    color: "lime",
  },
  darkText: {
    color: "#fff",
  },
  red: {
    color: "red",
  },
  green: {
    color: "lime",
  },
  cdaacceecaec: {
    marginTop: 10,
    borderRadius: 16,
    shadowColor: "#C8C8C8",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  vgjsdbhcd: {
    backgroundColor: "#161a1d",
    borderRadius: 8,
  },
});

export default DashboardAngel;
