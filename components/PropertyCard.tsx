import { Property } from "@/types";
import { formatPrice } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function PropertyCard({
  property,
  onUnsave,
  showSave = false,
}: {
  property: Property;
  onUnsave?: () => void;
  showSave?: boolean;
}) {
  const router = useRouter();
  const isSaved = true;

  return (
    <TouchableOpacity
      className="flex-row rounded-2xl mx-4 mb-4 overflow-hidden bg-white"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        opacity: property.is_sold ? 0.5 : 1,
      }}
      onPress={() => router.push(`/(root)/property/${property.id}`)}
    >
      <Image
        source={{
          uri:
            property.images.length > 0
              ? property.images[0]
              : require("@/assets/images/kribb.png"),
        }}
        className="w-28 h-28 "
        resizeMode="cover"
      />
      <View className="flex-1 p-3 justify-between">
        <View>
          <Text
            className="text-sm font-bold text-gray-800 mb-1"
            numberOfLines={1}
          >
            {property.title}
          </Text>
          <View className="flex-row items-center gap-1 mb-3">
            <Ionicons name="location-outline" size={13} color="#687280" />
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              {property.address}, {property.city}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-blue-600 font-bold text-base">
            {formatPrice(Number(property.price))}
          </Text>
          {/* sold badge */}
          {property.is_sold && (
            <View className=" bg-red-50 px-2 py-0.5 rounded-full">
              <Text className="text-xs font-semibold text-red-500">Sold</Text>
            </View>
          )}

          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={11} color="#687280" />
              <Text className="text-xs text-gray-500">
                {property.bedrooms} bd
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="expand-outline" size={11} color="#687280" />
              <Text className="text-xs text-gray-500">
                {property.area_sqft} ft sq.
              </Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity className="w-10 items-center pt-3">
        <Ionicons
          name={isSaved ? "heart" : "heart-outline"}
          size={18}
          color={isSaved ? "#EF4444" : "#9ca3af"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
