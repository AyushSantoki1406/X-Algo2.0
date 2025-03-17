// app/Screen/Home/components/MultiCalendar.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Picker } from "@react-native-picker/picker";
import { Circle as ProgressCircle } from "react-native-progress"; // Correct import for react-native-progress

interface SheetData {
  UserId: string;
  strategyName: string;
  sheetData?: any[];
  pnlByDate?: Record<string, number>;
  monthlyAccuracy?: Record<string, string>;
  monthlyRoi?: Record<string, string>;
}

interface MultiCalendarProps {
  index2: number;
  allSheetData: SheetData[];
  clientId: string;
  darkMode: boolean;
  updatedAllSheetData: SheetData[];
  selectedStrategy: string;
}

interface SelectedDateInfo {
  date: string | null;
  pnl: number | string | null;
}

const MultiCalendar: React.FC<MultiCalendarProps> = ({
  index2,
  allSheetData,
  clientId,
  darkMode,
  updatedAllSheetData,
  selectedStrategy,
}) => {
  const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDateInfo, setSelectedDateInfo] = useState<SelectedDateInfo>({
    date: null,
    pnl: null,
  });

  const handleDateChange = (value: string, type: "year" | "month") => {
    if (type === "year") {
      setSelectedYear(parseInt(value));
    } else if (type === "month") {
      setSelectedMonth(parseInt(value));
    }
  };

  const generatePnlMap = (sheetData: any[]): Record<string, number> => {
    const pnlMap: Record<string, number> = {};
    sheetData.forEach((entry) => {
      if (entry && entry.length > 10) {
        try {
          const date = format(new Date(entry[3].toString()), "yyyy-MM-dd");
          const pnl =
            typeof entry[10] === "string"
              ? parseFloat(entry[10]) || 0
              : entry[10] || 0;
          pnlMap[date] = (pnlMap[date] || 0) + pnl;
        } catch (e) {
          console.log("Error processing entry:", e);
        }
      }
    });
    return pnlMap;
  };

  const calculateMonthlyStats = (sheet: SheetData, selectedDate: Date) => {
    const monthKey = format(selectedDate, "yyyy-M");
    const monthlyAccuracy = sheet.monthlyAccuracy?.[monthKey] || "--";
    const monthlyRoi = sheet.monthlyRoi?.[monthKey] || "--";
    return { monthlyAccuracy, monthlyRoi };
  };

  const getPnlColor = (pnl: number, maxProfit: number, maxLoss: number) => {
    if (pnl > 0) {
      const percentage = (pnl / maxProfit) * 100;
      if (percentage <= 20) return "#97E097"; // Soft Mint Green
      else if (percentage <= 40) return "#79DD79"; // Fresh Grass Green
      else if (percentage <= 60) return "#72D172"; // Rich Forest Green
      else if (percentage <= 80) return "#5DD05D"; // Deep Emerald Green
      else return "#31C631"; // Intense Pine Green
    } else if (pnl < 0) {
      const percentage = (pnl / maxLoss) * 100;
      if (percentage <= -20) return "#FA0000"; // Deepest Red
      else if (percentage <= -40) return "#FA0000B3"; // Darker Red
      else if (percentage <= -60) return "#FA0000CC"; // Dark Red
      else if (percentage <= -80) return "#FA0000B3"; // Medium Red
      else return "#FA000099"; // Light Red
    }
    return darkMode ? "#222" : "#eee";
  };

  const filteredSheet = updatedAllSheetData.find(
    (sheet) =>
      sheet.UserId === clientId && sheet.strategyName === selectedStrategy
  );

  if (!filteredSheet) {
    return (
      <View style={[styles.calendar, darkMode && styles.darkCalendar]}>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>
          No data available for this client and strategy.
        </Text>
      </View>
    );
  }

  const { sheetData = [] } = filteredSheet;
  const pnlByDate = generatePnlMap(sheetData);
  const selectedDate = new Date(selectedYear, selectedMonth, 1);
  const { monthlyAccuracy, monthlyRoi } = calculateMonthlyStats(
    filteredSheet,
    selectedDate
  );
  const start = startOfWeek(startOfMonth(selectedDate));
  const end = endOfWeek(endOfMonth(selectedDate));
  const days = eachDayOfInterval({ start, end });
  const allProfits = Object.values(pnlByDate).filter(
    (pnl) => pnl !== undefined
  ) as number[];
  const maxProfit = allProfits.length > 0 ? Math.max(...allProfits) : 1;
  const maxLoss = allProfits.length > 0 ? Math.min(...allProfits) : -1;

  const accuracy = parseFloat(monthlyAccuracy) || 0;
  const roi = parseFloat(monthlyRoi) || 0;

  // Merge the textStyle prop into a single object
  const mergedTextStyle = {
    ...styles.progressText,
    ...(darkMode ? styles.darkText : {}),
  };

  return (
    <View
      key={index2}
      style={[styles.calendar, darkMode && styles.darkCalendar]}
    >
      <View style={styles.selectors}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(value) => handleDateChange(value.toString(), "month")}
          style={[styles.picker, darkMode && styles.darkPicker]}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Picker.Item
              key={i}
              label={format(new Date(selectedYear, i, 1), "MMMM")}
              value={i}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(value) => handleDateChange(value.toString(), "year")}
          style={[styles.picker, darkMode && styles.darkPicker]}
        >
          {yearOptions.map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>
      </View>

      <View style={styles.asdfaerewff}>
        <View style={styles.calendarFlex}>
          <View style={styles.calendarHeader}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <Text
                key={index}
                style={[styles.headerCell, darkMode && styles.darkHeaderCell]}
              >
                {day}
              </Text>
            ))}
          </View>
          <FlatList
            data={days}
            keyExtractor={(item) => item.toString()}
            numColumns={7}
            renderItem={({ item: day }) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const pnl = pnlByDate[dateKey] || 0;
              const isCurrentMonth = day.getMonth() === selectedMonth;

              return (
                <TouchableOpacity
                  onPress={() =>
                    isCurrentMonth &&
                    setSelectedDateInfo({ date: dateKey, pnl })
                  }
                  style={styles.cellContainer}
                >
                  <View
                    style={[
                      styles.calendarCell,
                      isCurrentMonth && {
                        backgroundColor: getPnlColor(pnl, maxProfit, maxLoss),
                      },
                      !isCurrentMonth && styles.emptyCell,
                    ]}
                  >
                    <Text
                      style={[
                        styles.cellText,
                        isCurrentMonth && darkMode && { color: "#fff" },
                        !isCurrentMonth && { color: "transparent" },
                      ]}
                    >
                      {isCurrentMonth ? day.getDate() : ""}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.calendarBody}
            showsVerticalScrollIndicator={false} // Disable vertical scrollbar
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View>
          <View>
            <View style={styles.ghjkxcvbnm}>
              <View style={styles.statItem}>
                <ProgressCircle
                  progress={accuracy / 100}
                  size={60}
                  thickness={8}
                  color={
                    accuracy < 33
                      ? "#FF5A5A"
                      : accuracy < 67
                      ? "#FBC02D"
                      : "#00FF88"
                  }
                  unfilledColor={darkMode ? "#444" : "#ddd"}
                  borderWidth={0}
                  showsText={true}
                  textStyle={mergedTextStyle} // Use the merged style object
                />
                <Text style={[styles.statLabel, darkMode && styles.darkText]}>
                  Accuracy
                </Text>
              </View>
              <View style={styles.statItem}>
                <ProgressCircle
                  progress={roi / 100}
                  size={60}
                  thickness={8}
                  color="#007BFF"
                  unfilledColor={darkMode ? "#444" : "#ddd"}
                  borderWidth={0}
                  showsText={true}
                  textStyle={mergedTextStyle} // Use the merged style object
                />
                <Text style={[styles.statLabel, darkMode && styles.darkText]}>
                  ROI
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={{ paddingTop: 5 }}>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>
          Selected Date and P&L:
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.infoText, darkMode && styles.darkText]}>
            {selectedDateInfo.date || "Select a date"}
          </Text>
          <Text
            style={[
              styles.infoText,
              darkMode && styles.darkText,
              typeof selectedDateInfo.pnl === "number" &&
              selectedDateInfo.pnl < 0
                ? styles.redText
                : styles.greenText,
            ]}
          >
            {typeof selectedDateInfo.pnl === "number"
              ? selectedDateInfo.pnl.toFixed(2)
              : selectedDateInfo.pnl || "0.00"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  calendar: {},
  darkCalendar: {
    backgroundColor: "#1E1E1E",
    shadowColor: "#fff",
    shadowOpacity: 0.1,
  },
  selectors: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
    backgroundColor: "red",
    borderRadius: 8,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  picker: {
    height: 40,
    width: width * 0.43,
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  darkPicker: {
    color: "#fff",
    backgroundColor: "#333",
  },
  calendarFlex: {
    flexDirection: "column",
    width: "70%",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  calendarBody: {
    paddingVertical: 5,
  },
  cellContainer: {
    width: `${100 / 7}%`,
    padding: 2,
  },
  calendarCell: {
    padding: 5,
    textAlign: "center",
    fontSize: 8,
    fontWeight: "500",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyCell: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  cellText: {
    color: "#000",
    fontSize: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  headerCell: {
    width: `${100 / 10}%`,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#444",
    color: "#fff",
    padding: 5,
    borderRadius: 4,
  },
  darkHeaderCell: {
    backgroundColor: "#555",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 8,
    color: "#333",
    fontWeight: "600",
  },
  progressText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
  },
  infoSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  darkText: {
    color: "#ddd",
  },
  redText: {
    color: "#FF5A5A",
  },
  greenText: {
    color: "#00FF88",
  },
  ghjkxcvbnm: {
    display: "flex",
    flexDirection: "column",
  },
  asdfaerewff: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});

export default MultiCalendar;
