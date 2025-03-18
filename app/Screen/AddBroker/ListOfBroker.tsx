import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ProductionUrl } from "../../../URL/url";
import {
  loginSuccess,
  angelId,
  deleteBroker,
  addItem,
  removeItem,
  brokerLogin,
  userSchemaRedux,
  allClientData,
} from "../../../components/redux/action/action";
import { RootState } from "../../../components/store";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

interface ClientDataItem {
  userData?: { data: { clientcode: string; name: string } };
  balances?: { result: { balance_inr: string | number; user_id: string }[] };
  userDetails?: { result: { first_name?: string; last_name?: string } };
  deltaApiKey?: string;
  [key: string]: any;
}

interface UserSchema {
  AccountAliases?: { [key: string]: string };
  AngelBrokerData?: Array<{ AngelId: string; Date?: string }>;
  DeltaBrokerSchema?: Array<{
    deltaApiKey: string;
    deltaBrokerId?: string;
    Date?: string;
  }>;
  BrokerIds?: string[];
  [key: string]: any;
}

const Listofbroker = () => {
  const userSchema = useSelector(
    (state: RootState) => state.account.userSchemaRedux
  ) as UserSchema;
  const clientdata = useSelector(
    (state: RootState) => state.account.allClientData
  ) as ClientDataItem[];
  const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.email.email);
  const items = useSelector((state: RootState) => state.account.items);
  const [existingAlias, setExistingAlias] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertMessage2, setAlertMessage2] = useState("");
  const [id, setId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [pass, setPass] = useState("");
  const [accountAliases, setAccountAliases] = useState<{
    [key: string]: string;
  }>({});
  const [broker, setBroker] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [deltaSecret, setDeltaSecret] = useState("");
  const [deltaKey, setDeltaKey] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addedId, setAddedId] = useState("");
  const [apikey, setApiKey] = useState("");
  const [selectBroker, setSelectBroker] = useState("1"); // Default to "AngelOne"
  const [angelIdExist, setAngelIdExist] = useState(false);
  const [deltaApiKeyExist, setDeltaApiKeyExist] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // State to track expanded row

  const navigation = useNavigation();
  const url =
    process.env.NODE_ENV === "production" ? ProductionUrl : ProductionUrl;

  useEffect(() => {
    const fetchData = async () => {
      setTableLoader(true);
      try {
        const profileData = await axios.post(`${url}/userinfo`, {
          Email: email,
        });
        console.log("Profile Data:", profileData.data);
        dispatch(allClientData(profileData.data));
        const dbschema = await axios.post(`${url}/dbSchema`, { Email: email });
        console.log(
          "DB Schema AccountAliases:",
          dbschema?.data?.AccountAliases
        );
        dispatch(userSchemaRedux(dbschema.data));
        setAccountAliases(dbschema?.data?.AccountAliases || {});
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTableLoader(false);
      }
    };
    fetchData();
  }, []);

  const showAlertWithTimeout = (message: string, duration: number) => {
    setShowAlert(true);
    setAlertMessage(message);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, duration);
  };

  const showAlertWithTimeout2 = (message: string, duration: number) => {
    setShowAlert2(true);
    setAlertMessage2(message);
    setTimeout(() => {
      setShowAlert2(false);
      setAlertMessage2("");
    }, duration);
  };

  const checkAccountAlias = (accountName: string) => {
    const aliases = userSchema.AccountAliases || {};
    const aliasExists = Object.values(aliases).some(
      (alias: string) => alias.toLowerCase() === accountName.toLowerCase()
    );
    setExistingAlias(aliasExists);
  };

  const handleAccountNameChange = (value: string) => {
    setAccountName(value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const newTimeout = setTimeout(() => {
      checkAccountAlias(value);
    }, 50);
    setTypingTimeout(newTimeout);
  };

  const addBrokerBtn = async () => {
    setLoading(true);
    let userExist = false;

    if (userSchema.AngelBrokerData) {
      userExist = userSchema.AngelBrokerData.some(
        (item) => item.AngelId === id
      );
    }
    if (userSchema.DeltaBrokerSchema) {
      userExist = userSchema.DeltaBrokerSchema.some(
        (item) => item.deltaApiKey === deltaKey
      );
    }
    if (userSchema.AccountAliases) {
      setExistingAlias(
        Object.values(userSchema.AccountAliases).some(
          (alias: string) => alias.toLowerCase() === accountName.toLowerCase()
        )
      );
    }

    if (existingAlias) {
      showAlertWithTimeout("Account Name is not available", 2000);
      setLoading(false);
      return;
    } else if (userExist) {
      showAlertWithTimeout("Broker already added", 2000);
      setLoading(false);
      return;
    } else {
      try {
        if (selectBroker === "1") {
          const response = await axios.post(`${url}/addbroker`, {
            First: true,
            id,
            pass,
            email,
            secretKey,
            userSchema,
            ApiKey: apikey,
            accountName,
          });

          if (!response.data) {
            showAlertWithTimeout("Invalid id or password", 5000);
            setLoading(false);
          } else {
            dispatch(loginSuccess(response.data));
            dispatch(angelId({ id, pass }));
            setBroker("");
            showAlertWithTimeout2("Successfully added", 3000);
            Alert.alert("Success", "Account added successfully");

            const dbschema = await axios.post(`${url}/dbSchema`, {
              Email: email,
            });
            dispatch(userSchemaRedux(dbschema.data));
            setAccountAliases(dbschema?.data?.AccountAliases || {});
            if (dbschema.data.BrokerCount) {
              dispatch(brokerLogin(true));
            } else {
              dispatch(brokerLogin(false));
            }

            setAddedId(id);
            setId("");
            setPass("");
            setSecretKey("");
            setApiKey("");
            setAccountName("");
            setLoading(false);

            const profileData = await axios.post(`${url}/userinfo`, {
              Email: email,
            });
            dispatch(allClientData(profileData.data));
          }
        } else if (selectBroker === "2") {
          const response = await axios.post(`${url}/addDeltaBroker`, {
            email,
            apiKey: deltaKey,
            apiSecret: deltaSecret,
          });

          if (!response.data.success) {
            showAlertWithTimeout("Invalid id or password", 5000);
            setLoading(false);
          } else {
            showAlertWithTimeout2("Successfully added", 3000);
            Alert.alert("Success", "Account added successfully");

            const dbschema = await axios.post(`${url}/dbSchema`, {
              Email: email,
            });
            dispatch(userSchemaRedux(dbschema.data));
            setAccountAliases(dbschema?.data?.AccountAliases || {});
            if (dbschema.data.BrokerCount) {
              dispatch(brokerLogin(true));
            } else {
              dispatch(brokerLogin(false));
            }

            setDeltaKey("");
            setDeltaSecret("");
            setAccountName("");
            setLoading(false);

            const profileData = await axios.post(`${url}/userinfo`, {
              Email: email,
            });
            dispatch(allClientData(profileData.data));
          }
        }
      } catch (e) {
        console.log("Error is " + e);
        showAlertWithTimeout("An error occurred", 5000);
        setLoading(false);
      }
    }
  };

  const delete_broker_fun = async (index: number, clientId: string) => {
    console.log("Deleting broker at index:", index, "with clientId:", clientId);
    Alert.alert("Confirm Deletion", "Do you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, delete it!",
        onPress: async () => {
          try {
            setLoading(true);
            // Attempt to delete using clientId only
            const response = await axios.post(`${url}/removeClient`, {
              Email: email,
              clientId, // Removed index to see if backend uses clientId only
            });
            console.log("API Response:", response.data);
            setLoading(false);

            // Check response status
            if (
              response.data &&
              response.data.message === "Broker removed successfully"
            ) {
              // Fetch updated data after deletion
              const profileData = await axios.post(`${url}/userinfo`, {
                Email: email,
              });
              console.log("Updated Profile Data:", profileData.data);
              dispatch(allClientData(profileData.data));

              const dbschema = await axios.post(`${url}/dbSchema`, {
                Email: email,
              });
              console.log("Updated DB Schema:", dbschema.data);
              dispatch(userSchemaRedux(dbschema.data));
              setAccountAliases(dbschema?.data?.AccountAliases || {});
              showAlertWithTimeout2("Broker removed successfully", 3000);
              setIsLoggedIn(false);
              dispatch(brokerLogin(false));
              dispatch(removeItem());
            } else {
              Alert.alert(
                "Error",
                "Failed to remove broker: " +
                  (response.data.message || "Unknown error")
              );
            }
          } catch (error: any) {
            console.error(
              "Error deleting broker:",
              error.response?.data || error.message
            );
            Alert.alert(
              "Error",
              "Failed to remove broker: " +
                (error.response?.data?.message || error.message)
            );
            setLoading(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleAngelId = (value: string) => {
    setId(value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const newTimeout = setTimeout(() => {
      const exists = userSchema.BrokerIds?.includes(value) || false;
      setAngelIdExist(exists);
    }, 500);
    setTypingTimeout(newTimeout);
  };

  const handleDeltaKeyChange = (value: string) => {
    setDeltaKey(value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const newTimeout = setTimeout(() => {
      const deltaApiKeyExists =
        userSchema.DeltaBrokerSchema?.some(
          (item) => item.deltaApiKey === value
        ) || false;
      setDeltaApiKeyExist(deltaApiKeyExists);
    }, 500);
    setTypingTimeout(newTimeout);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Manage Broker</Text>
        </View>
      </View>

      {showAlert && (
        <View style={styles.alertDanger}>
          <Text style={styles.alertText}>{alertMessage}</Text>
        </View>
      )}
      {showAlert2 && (
        <View style={styles.alertSuccess}>
          <Text style={styles.alertText}>{alertMessage2}</Text>
        </View>
      )}

      <View style={styles.brokerList}>
        <View style={styles.inputContainer}>
          <View style={styles.brokerGuide}>
            <Picker
              selectedValue={selectBroker}
              onValueChange={(value: string) => {
                setId("");
                setAccountName("");
                setDeltaKey("");
                setExistingAlias(false);
                setAngelIdExist(false);
                setDeltaApiKeyExist(false);
                setSelectBroker(value);
              }}
              style={styles.picker}
            >
              <Picker.Item label="AngelOne" value="1" />
              <Picker.Item label="Delta" value="2" />
              <Picker.Item label="Upstox" value="3" />
            </Picker>
            <TouchableOpacity
              onPress={() => console.log("Guide link clicked")}
              style={styles.helpLink}
            >
              <Text style={styles.helpText}>?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Account Name"
              value={accountName}
              onChangeText={handleAccountNameChange}
            />
            {existingAlias && (
              <Text style={styles.errorText}>Account name already exists</Text>
            )}
            {selectBroker === "1" && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Client ID"
                  value={id}
                  onChangeText={handleAngelId}
                />
                {angelIdExist && (
                  <Text style={styles.errorText}>Broker already exists</Text>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Enter Pin"
                  value={pass}
                  onChangeText={setPass}
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  placeholder="Totp Key"
                  value={secretKey}
                  onChangeText={setSecretKey}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Api Key"
                  value={apikey}
                  onChangeText={setApiKey}
                />
              </>
            )}
            {selectBroker === "2" && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="API Key"
                  value={deltaKey}
                  onChangeText={handleDeltaKeyChange}
                />
                {deltaApiKeyExist && (
                  <Text style={styles.errorText}>API key already exists</Text>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="API Secret"
                  value={deltaSecret}
                  onChangeText={setDeltaSecret}
                  secureTextEntry
                />
              </>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.addButton,
              (existingAlias || angelIdExist) && styles.disabledButton,
            ]}
            onPress={addBrokerBtn}
            disabled={existingAlias || angelIdExist}
          >
            <Text style={styles.addButtonText}>Add Broker</Text>
          </TouchableOpacity>
        </View>

        {tableLoader ? (
          <View style={styles.skeletonContainer}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.skeleton} />
            ))}
          </View>
        ) : (
          <FlatList
            data={clientdata}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const userId = item.balances?.result[0]?.user_id || "N/A";
              const alias =
                accountAliases[item.userData?.data?.clientcode || userId] ||
                accountName ||
                "N/A";
              const isExpanded = expandedIndex === index;

              return (
                <TouchableOpacity
                  onPress={() => toggleExpand(index)}
                  style={
                    isExpanded
                      ? styles.expandedTableRow
                      : styles.compactTableRow
                  }
                >
                  {/* Compact View */}
                  <Text style={styles.compactTableCell}>{alias}</Text>

                  {/* Expanded View */}
                  {isExpanded && (
                    <View style={styles.expandedDetails}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Account Name:</Text>
                        <Text style={styles.detailValue}>{alias}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Broker Name:</Text>
                        <Text style={styles.detailValue}>
                          {item.userData
                            ? "AngelOne"
                            : item.deltaApiKey
                            ? "Delta"
                            : "N/A"}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Account Alias:</Text>
                        <Text style={styles.detailValue}>{alias}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text
                          style={styles.detailValue}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.userData
                            ? item.userData?.data?.name?.toUpperCase()
                            : `${
                                item.userDetails?.result?.first_name?.toUpperCase() ||
                                ""
                              } ${
                                item.userDetails?.result?.last_name?.toUpperCase() ||
                                ""
                              }`.trim() || "N/A"}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Client ID:</Text>
                        <Text style={styles.detailValue}>
                          {item.userData?.data?.clientcode || userId}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date:</Text>
                        <Text style={styles.detailValue}>
                          {item.userData
                            ? userSchema.AngelBrokerData?.find(
                                (broker) =>
                                  broker.AngelId ===
                                  item.userData?.data?.clientcode
                              )?.Date || "N/A"
                            : userSchema.DeltaBrokerSchema?.find(
                                (broker) => broker.deltaBrokerId === userId
                              )?.Date || "N/A"}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          delete_broker_fun(
                            index,
                            item.userData?.data?.clientcode || userId
                          )
                        }
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
            style={styles.table}
            contentContainerStyle={styles.tableContent}
          />
        )}
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    padding: 5,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  brokerList: {
    padding: 10,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  brokerGuide: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  picker: {
    height: 40,
    width: "100%",
    color: "gray",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  helpLink: {
    marginLeft: 10,
  },
  helpText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FCD535",
  },
  inputRow: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#FCD535",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  skeletonContainer: {
    marginTop: 10,
  },
  skeleton: {
    height: 60,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 4,
  },
  table: {
    flex: 1,
  },
  tableContent: {
    paddingBottom: 20,
  },
  compactTableRow: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expandedTableRow: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compactTableCell: {
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 10,
  },
  expandedDetails: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  detailLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  alertDanger: {
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  alertSuccess: {
    backgroundColor: "#d4edda",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  alertText: {
    color: "#721c24",
    textAlign: "center",
  },
});

export default Listofbroker;
