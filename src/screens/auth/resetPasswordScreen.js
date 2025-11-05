// src/screens/auth/ResetPasswordScreen.js
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
import EyeOffIcon from "../../../assets/icons/eye-off.svg";
import EyeIcon from "../../../assets/icons/eye.svg";
import PasswordIcon from "../../../assets/icons/password.svg";
import SecuritySafeIcon from "../../../assets/icons/security_safe.svg";
import AppButton from "../../components/appButton";
import AuthHeader from "../../components/auth/authHeader";
import InputField from "../../components/auth/inputField";
import Colors from "../../styles/color";

const ResetPasswordScreen = ({ navigation, route }) => {
  const { email, otp } = route.params;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm Password is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    const { password } = data;
    setLoading(true);

    try {
      // TODO: Call API to reset password
      // await api.resetPassword(email, otp, password);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Your password has been reset successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Navigate back to Sign In screen
            navigation.reset({
              index: 0,
              routes: [{ name: "SignIn" }],
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to reset password. Please try again.");
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
            title="Reset Password"
            subtitle="Create your new password"
            showLogo={false}
          />
        </View>

        <View style={styles.form}>
          <InputField
            name="password"
            icon={PasswordIcon}
            label="New Password"
            placeholder="Enter new password"
            control={control}
            error={errors.password}
            secureTextEntry={!showPassword}
            showToggle={true}
            onTogglePress={() => setShowPassword(!showPassword)}
            rightIcon={showPassword ? EyeIcon : EyeOffIcon}
          />

          <InputField
            name="confirmPassword"
            icon={PasswordIcon}
            label="Confirm Password"
            placeholder="Confirm new password"
            control={control}
            error={errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            showToggle={true}
            onTogglePress={() => setShowConfirmPassword(!showConfirmPassword)}
            rightIcon={showConfirmPassword ? EyeIcon : EyeOffIcon}
          />

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            <Text style={styles.requirementItem}>• At least 6 characters</Text>
            <Text style={styles.requirementItem}>
              • Both uppercase and lowercase letters (recommended)
            </Text>
            <Text style={styles.requirementItem}>
              • At least one number (recommended)
            </Text>
          </View>

          <AppButton
            text={loading ? "Resetting..." : "Reset Password"}
            onPress={handleSubmit(onSubmit)}
            style={styles.resetButton}
            textStyle={styles.resetButtonText}
            disabled={loading}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={styles.loader}
            />
          )}
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
  passwordRequirements: {
    backgroundColor: Colors.gray,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 12,
    color: "#666",
    lineHeight: 20,
  },
  resetButton: {
    width: "100%",
    height: 48,
    borderRadius: 100,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 20,
  },
  headerContainerWithIcon: {
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});

export default ResetPasswordScreen;
