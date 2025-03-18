import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Listofbroker from "./ListOfBroker";

interface BrokerProps {
  setLoading: (loading: boolean) => void;
}

const Broker = ({}) => {
  return (
    <View style={styles.container}>
      <Listofbroker />
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brokerList: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 16,
    marginTop: 80,
    backgroundColor: "#fff",
  },
  brokerGuide: {
    width: 256,
  },
  input: {
    backgroundColor: "transparent",
    color: "#000",
  },
  picker: {
    backgroundColor: "transparent",
    color: "#000",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableHeader: {
    backgroundColor: "#fff",
    color: "#000",
  },
  tableRow: {
    backgroundColor: "#fff",
    color: "#000",
  },
  listTitle: {
    fontSize: 25.6,
    fontWeight: "600",
    textAlign: "left",
  },
  addBroker: {
    marginLeft: 240,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  addBrokerTitle: {
    textAlign: "center",
    fontSize: 25.6,
  },
  abcdefg: {
    height: 640,
  },
  amxjy: {
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  selectBroker: {
    marginTop: 32,
    marginLeft: 32,
  },
  drop: {
    marginLeft: 32,
  },
  alert: {
    opacity: 0,
    width: "100%",
  },
  showAlert: {
    opacity: 1,
  },
  help: {
    color: "#fff",
  },
  bubble: {
    position: "absolute",
    width: 208,
    height: 80,
    top: -108.8,
    left: 704,
    backgroundColor: "#0d6efd",
    borderRadius: 10,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble1: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Broker;
