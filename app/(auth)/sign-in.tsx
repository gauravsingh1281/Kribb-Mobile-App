import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const isLoading = fetchStatus === "fetching";

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({
      code,
    });
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });
    if (error) {
      alert(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) await signIn.mfa.sendEmailCode();
    } else {
      console.log("Sign in attempt not complete:", signIn);
    }
  };
  if (signIn.status === "needs_client_trust") {
    return (
      <View className="flex-1  justify-center px-6 py-12">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Verify your account
        </Text>
        <Text className=" text-gray-500 mb-8">We sent a code to {email}</Text>
        <View className="flex-col gap-3 mb-4 ">
          <TextInput
            className="border border-gray-300 rounded-xl px-3 py-4"
            placeholder="Enter verification code"
            placeholderTextColor="#9Ca3af"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            secureTextEntry
          />
          {errors.fields.code && (
            <Text className="text-red-500">{errors.fields.code.message}</Text>
          )}
          <TouchableOpacity
            onPress={onVerifyPress}
            disabled={isLoading}
            className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Verify</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => signIn.mfa.sendEmailCode()}
            className="py-2"
          >
            <Text className="text-blue-600">I need a new code</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1  justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Back
        </Text>
        <Text className=" text-gray-500 mb-8">Find your dream home today</Text>

        <View className="flex gap-4">
          <TextInput
            className=" w-full  border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Email"
            placeholderTextColor="#9Ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.fields.identifier && (
            <Text className="text-red-500 mb-4">
              {errors.fields.identifier.message}
            </Text>
          )}
          <TextInput
            className=" w-full  border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Password"
            placeholderTextColor="#9Ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.fields.password && (
            <Text className="text-red-500 mb-4">
              {errors.fields.password.message}
            </Text>
          )}
          <TouchableOpacity
            onPress={onSignInPress}
            disabled={isLoading}
            className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Sign In</Text>
            )}
          </TouchableOpacity>
          <View className="flex-row justify-center">
            <Text>Dont have an account? </Text>
            <Link href="./sign-up">
              <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </Link>
          </View>
          <View nativeID="clerk-captcha" />
        </View>
      </View>
    </ScrollView>
  );
}
