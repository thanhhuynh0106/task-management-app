// src/navigations/authStack.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import PrivacyPolicyScreen from "../screens/auth/privacyPolicyScreen";
import SignInScreen from "../screens/auth/signInScreen";
import SignUpScreen from "../screens/auth/signUpScreen";
import TermsConditionsScreen from "../screens/auth/termsConditionsScreen";
import ForgotPasswordScreen from "../screens/auth/forgotPasswordScreen";
import VerifyOTPScreen from "../screens/auth/verifyOTPScreen";
import ResetPasswordScreen from "../screens/auth/resetPasswordScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />

      {/* Forgot Password Flow */}
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

      {/* Modal Screens */}
      <Stack.Screen
        name="TermsConditions"
        component={TermsConditionsScreen}
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
