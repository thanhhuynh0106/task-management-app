// src/screens/auth/ForgotPasswordScreen.js
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import EmailIcon from "../../../assets/icons/email.svg";
import SecuritySafeIcon from "../../../assets/icons/security_safe.svg";
import AppButton from "../../components/appButton";
import AuthHeader from "../../components/auth/authHeader";
import InputField from "../../components/auth/inputField";
import Colors from "../../styles/color";

const ForgotPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    const { email } = data;
    setLoading(true);

    try {
      // TODO: Call API to send OTP to email
      // await api.forgotPassword(email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to OTP verification screen with email
      navigation.navigate("VerifyOTP", { email: email.trim() });
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to send verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerContainerWithIcon}>
          <SecuritySafeIcon width={60} height={60} />
          <AuthHeader
            title="Forgot Password"
            subtitle="Enter your email to receive a verification code"
            showLogo={false}
          />
        </View>

        <View style={styles.form}>
          <InputField
            name="email"
            icon={EmailIcon}
            label="Email"
            placeholder="Enter your email"
            control={control}
            error={errors.email}
            keyboardType="email-address"
          />

          <AppButton
            text={loading ? "Sending..." : "Send Verification Code"}
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
            textStyle={styles.submitButtonText}
            disabled={loading}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={styles.loader}
            />
          )}

          <View style={styles.backToSignInContainer}>
            <Text style={styles.backToSignInText}>
              Remember your password?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.backToSignInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.black,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  submitButton: {
    width: "100%",
    height: 48,
    borderRadius: 100,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 20,
  },
  backToSignInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  backToSignInText: {
    fontSize: 14,
    color: "#666",
  },
  backToSignInLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  headerContainerWithIcon: {
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});

export default ForgotPasswordScreen;
