// app/Screen/Home/components/StrategyCard.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Image } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface SheetData {
  _id: string;
  title: string;
  strategyType: string;
  capitalRequirement: string;
  description: string;
  createdBy: string;
  dateOfCreation: string;
  subscribeCount: number;
  deployedCount: number;
  days: string;
  time: string;
}

interface StrategyCardProps {
  index2: number; // Placeholder prop, adjust as needed
  darkMode: boolean;
  // Add other props as needed based on your app's context
}

interface SelectedDateInfo {
  date: string | null;
  pnl: number | string | null;
}

const MarketPlace = () => {
  const [strategyData, setStrategyData] = useState<SheetData[]>([]);
  const [subscribedStrategies, setSubscribedStrategies] = useState<string[]>(
    []
  );
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(
    null
  );
  const [Quaninty, setQuaninty] = useState("");
  const [Index, setIndex] = useState("");
  const [Account, setAccount] = useState("");
  const [SOL, setSOL] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertMessage2, setAlertMessage2] = useState("");
  const [clientIds, setClientIds] = useState<string[]>([]);
  const [loader, setLoader] = useState(false);
  const [deployedBtnLoader, setDeployedBtnLoader] = useState(false);
  const [brokerId, setBrokerId] = useState<string[]>([]);
  const [deployedBrokerIds, setDeployedBrokerIds] = useState<string[]>([]);
  const [dropDownIds, setDropDownIds] = useState<string[]>([]);

  console.log(deployedBrokerIds);

  const handleOpen = (strategyId: string) => {
    console.log(strategyId);
    setSelectedStrategyId(strategyId);

    // Placeholder for userSchema logic (replace with native state management)
    const userSchema = {
      DeployedData: [],
      BrokerIds: [],
      AccountAliases: {},
      DeployedStrategiesBrokerIds: [],
    }; // Mock data, replace with actual state

    // Get matching accounts based on the selected strategy
    const matchingAccounts = (
      userSchema.DeployedData as { Strategy: string; Account: string }[]
    )
      .filter((deployed) => deployed.Strategy === strategyId)
      .map((deployed) => deployed.Account);

    console.log("Matching Accounts:", matchingAccounts);

    // Filter brokerIds to exclude matching accounts
    const filteredBrokerIds = userSchema.BrokerIds.filter(
      (brokerId) => !matchingAccounts.includes(brokerId)
    );

    console.log("Filtered Broker IDs:", filteredBrokerIds);

    // Map filteredBrokerIds to their aliases
    const accountAliases = userSchema.AccountAliases || {};
    const filteredAliases = filteredBrokerIds.map(
      (brokerId) => accountAliases[brokerId] || brokerId
    );

    console.log("Filtered Aliases:", filteredAliases);

    // Set dropdown values to the aliases
    setDropDownIds(filteredAliases);

    setOpen(true);
  };

  const handleClose = () => {
    setSelectedStrategyId(null);
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  const handleInputChange = (value: string, field: string) => {
    if (field === "Quaninty") {
      setQuaninty(value);
    } else if (field === "Index") {
      setIndex(value);
    } else if (field === "Account") {
      setAccount(value);
    } else if (field === "SOL") {
      setSOL(parseInt(value) || 0);
    }
  };

  useEffect(() => {
    // Placeholder for API call (replace with native fetch or AsyncStorage)
    const fetchData = async () => {
      try {
        setLoader(true);
        setDeployedBrokerIds([]); // Mock data
        // Replace with actual API call
        const mockResponse = {
          data: {
            allData: [
              {
                _id: "1",
                title: "Strategy 1",
                strategyType: "Type A",
                capitalRequirement: "$1000",
                description: "Description 1",
                createdBy: "User1",
                dateOfCreation: new Date().toISOString(),
                subscribeCount: 10,
                deployedCount: 5,
                days: "5",
                time: "10:00",
              },
              // Add more mock data as needed
            ],
            SubscribedStrategies: [],
            userSchema: {},
          },
        };
        setStrategyData(mockResponse.data.allData);
        setSubscribedStrategies(mockResponse.data.SubscribedStrategies);
        setBrokerId([]);
        setDeployedBrokerIds([]);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = (strategyId: string) => {
    // Placeholder for API call
    console.log("Subscribing to:", strategyId);
    setSubscribedStrategies((prev) => [...prev, strategyId]);
  };

  const showAlertWithTimeout2 = (message: string, duration: number) => {
    setShowAlert2(true);
    setAlertMessage2(message);

    setTimeout(() => {
      setShowAlert2(false);
      setAlertMessage2("");
    }, duration);
  };

  const handleDeploy = () => {
    // Placeholder for API call
    console.log("Deploying with:", { selectedStrategyId, Quaninty, Account });
    handleClose();
    showAlertWithTimeout2("Successfully added", 3000);
    setDeployedBtnLoader(false);
  };

  // Mock image import (replace with actual image path)
  const image = require("../../../assets/StrategyImage.jpeg");

  return (
    <View style={styles.marketPlace}>
      <View style={styles.cardContainer}>
        {loader ? (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            data={strategyData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Image source={image} style={styles.strategyIcon} />
                    <View style={styles.strategyDetails}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.strategyType}>
                        Strategy: {item.strategyType}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.capitalInfo}>
                  <Text style={styles.capitalLabel}>
                    Capital requirement :{" "}
                  </Text>
                  <Text>{item.capitalRequirement}</Text>
                </View>

                <View style={styles.strategyInfo}>
                  <Text>{item.description}</Text>
                </View>

                <View style={styles.executionInfo}>
                  <View style={styles.createdByInfo}>
                    <Text style={styles.createdByIcon}>✍️</Text>
                    <Text>Created By: {item.createdBy}</Text>
                  </View>
                  <View style={styles.creationDateInfo}>
                    <Text style={styles.dateIcon}>📅</Text>
                    <Text>
                      Created on:{" "}
                      {new Date(item.dateOfCreation).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </Text>
                  </View>

                  <View style={styles.dFlex}>
                    <View style={styles.subscriberInfo}>
                      <Text style={styles.subscriberIcon}>👥</Text>
                      <Text>Subscriber : {item.subscribeCount}</Text>
                    </View>
                    <View style={styles.deployedInfo}>
                      <Text style={styles.deployedIcon}>🚀</Text>
                      <Text>Deployed : {item.deployedCount}</Text>
                    </View>
                  </View>
                  <View style={styles.timeInfo}>
                    <Text style={styles.clockIcon}>🕒</Text>
                    <Text>
                      {item.days} at {item.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={[
                      styles.subscribeBtn,
                      subscribedStrategies.includes(item._id) &&
                        styles.disabledBtn,
                    ]}
                    onPress={() => handleSubscribe(item._id)}
                    disabled={subscribedStrategies.includes(item._id)}
                  >
                    <Text>
                      {subscribedStrategies.includes(item._id)
                        ? "Subscribed"
                        : "Subscribe"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.deployBtn,
                      !subscribedStrategies.includes(item._id) &&
                        styles.disabledBtn,
                    ]}
                    onPress={() => handleOpen(item._id)}
                    disabled={!subscribedStrategies.includes(item._id)}
                  >
                    <Text>Deploy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={open}
          onRequestClose={handleClose}
        >
          <View style={styles.subModel}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Deployment Configuration</Text>
              <Text style={styles.modalDescription}>
                Please configure the details below before {"\n"} deploying the
                strategy:
              </Text>
              <View style={styles.form}>
                {/* Quantity Field */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Multiplier:</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={Quaninty}
                    onChangeText={(value) =>
                      handleInputChange(value, "Quaninty")
                    }
                    placeholder="Enter Multiplier"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Stop On Loss(%):</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={SOL.toString()}
                    onChangeText={(value) => handleInputChange(value, "SOL")}
                    placeholder="Enter SOL"
                  />
                </View>

                {/* Account Dropdown */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Select Account:</Text>
                  <Picker
                    selectedValue={Account}
                    onValueChange={(value: string) =>
                      handleInputChange(value, "Account")
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Choose an account" value="" />
                    {dropDownIds.map((id, index) => (
                      <Picker.Item key={index} label={id} value={id} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deployBtnModal}
                  onPress={handleDeploy}
                  disabled={deployedBtnLoader}
                >
                  {deployedBtnLoader ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.buttonText}>Deploy</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  marketPlace: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5F5F5",
  },
  cardContainer: {
    flex: 1,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  strategyIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  strategyDetails: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  strategyType: {
    fontSize: 14,
    color: "#666",
  },
  capitalInfo: {
    flexDirection: "row",
    marginBottom: 5,
  },
  capitalLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  strategyInfo: {
    marginBottom: 10,
  },
  executionInfo: {
    marginBottom: 10,
  },
  createdByInfo: {
    flexDirection: "row",
    marginBottom: 5,
  },
  createdByIcon: {
    marginRight: 5,
  },
  creationDateInfo: {
    flexDirection: "row",
    marginBottom: 5,
  },
  dateIcon: {
    marginRight: 5,
  },
  dFlex: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 5,
  },
  subscriberInfo: {
    flexDirection: "row",
  },
  subscriberIcon: {
    marginRight: 5,
  },
  deployedInfo: {
    flexDirection: "row",
  },
  deployedIcon: {
    marginRight: 5,
  },
  timeInfo: {
    flexDirection: "row",
  },
  clockIcon: {
    marginRight: 5,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subscribeBtn: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  deployBtn: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
  },
  disabledBtn: {
    backgroundColor: "#ccc",
    color: "#666",
  },
  subModel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: 350,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    width: 120,
    textAlign: "left",
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    fontSize: 14,
  },
  picker: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cancelBtn: {
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  deployBtnModal: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  noStrategyMessage: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#333",
    padding: 10,
  },
});

export default MarketPlace;
