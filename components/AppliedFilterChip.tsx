import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AppliedFilterChipProps {
  filter: string | number;
  func: () => void;
  icons?: any;
}

export default function AppliedFilterChip({
  filter,
  func,
  icons,
}: AppliedFilterChipProps) {
  return (
    <View className="flex-row  items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1">
      {icons}
      <Text className="text-blue-700 text-xs font-semibold capitalize">
        {filter}
      </Text>
      <TouchableOpacity onPress={func}>
        <Ionicons name="close" size={12} color="#1d4ed8" />
      </TouchableOpacity>
    </View>
  );
}
