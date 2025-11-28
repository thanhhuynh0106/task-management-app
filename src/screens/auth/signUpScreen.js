// src/screens/auth/signUpScreen.js
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import UserIcon from "../../../assets/icons/user.svg";
import CompanyIcon from "../../../assets/icons/company.svg";
import EmailIcon from "../../../assets/icons/email.svg";
import EyeOffIcon from "../../../assets/icons/eye-off.svg";
import EyeIcon from "../../../assets/icons/eye.svg";
import PasswordIcon from "../../../assets/icons/password.svg";

import AppButton from "../../components/appButton";
import AuthHeader from "../../components/auth/authHeader";
import CheckboxField from "../../components/auth/checkboxField";
import InputField from "../../components/auth/inputField";
import PhoneInputField from "../../components/auth/phoneInputField";
import { useAuth } from "../../contexts/authContext";
import Colors from "../../styles/color";
import LoadingSpinner from "../../components/loadingSpinner";

const SignUpScreen = ({ navigation }) => {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required("Full name is required")
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    // phone: Yup.string()
    //   .required("Phone number is required")
    //   .matches(/^[0-9]+$/, "Phone number is invalid"),
    employeeId: Yup.string().required("Employee ID is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Confirm Password is required"),
    agreeTerms: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions")
      .required("You must accept the terms and conditions"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      employeeId: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data) => {
    const { email, employeeId, password, fullName } = data;

    setIsLoading(true);
    try {
      const userData = {
        email: email.trim(),
        password: password.trim(),
        profile: {
          fullName: fullName.trim(),
          employeeId: employeeId.trim(),
        },
      };

      const result = await signUp(userData);

      if (!result.success) {
        Alert.alert("Error", result.error || "Failed to sign up.");
        return;
      }

      Alert.alert("Success", "Registration successful!");
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const onInvalid = () => {
    if (errors.fullName) setFocus("fullName");
    else if (errors.email) setFocus("email");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner text="Creating your account..." />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <SafeAreaView style={styles.safeArea}>
        <AuthHeader
          title="Sign Up"
          subtitle="Register Using Your Credentials"
          showLogo={true}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          bounces={Platform.OS === "ios"}
          nestedScrollEnabled={true}
        >
          {/* --- THÊM Ô INPUT FULL NAME --- */}
          <InputField
            name="fullName"
            // Nếu chưa có UserIcon, tạm thời dùng EmailIcon hoặc CompanyIcon
            icon={UserIcon || CompanyIcon}
            label="Full Name"
            placeholder="Lionel Messi"
            control={control}
            error={errors.fullName}
            autoCapitalize="words" // Tự động viết hoa chữ cái đầu
          />

          <InputField
            name="email"
            icon={EmailIcon}
            label="Email"
            placeholder="mdt@gmail.com"
            control={control}
            error={errors.email}
            keyboardType="email-address"
          />
          {/* 
          <PhoneInputField
            name="phone"
            label="Phone Number"
            control={control}
            error={errors.phone}
          /> */}

          <InputField
            name="employeeId"
            icon={CompanyIcon}
            label="Employee ID"
            placeholder="E12345"
            control={control}
            error={errors.employeeId}
          />

          <InputField
            name="password"
            icon={PasswordIcon}
            label="Password"
            placeholder="••••••••"
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
            placeholder="••••••••"
            control={control}
            error={errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            showToggle={true}
            onTogglePress={() => setShowConfirmPassword(!showConfirmPassword)}
            rightIcon={showConfirmPassword ? EyeIcon : EyeOffIcon}
          />

          <CheckboxField
            name="agreeTerms"
            control={control}
            error={errors.agreeTerms}
          >
            <Text style={styles.checkboxText}>
              I agree with{" "}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("TermsConditions")}
              >
                terms & conditions
              </Text>
              {" and "}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("PrivacyPolicy")}
              >
                privacy policy
              </Text>
            </Text>
          </CheckboxField>

          <AppButton
            text="Sign Up"
            onPress={handleSubmit(onSubmit, onInvalid)}
            style={styles.signUpButton}
            textStyle={styles.signUpButtonText}
          />

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signInLink}>Sign in here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  form: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  checkboxText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  signUpButton: {
    width: "100%",
    height: 48,
    borderRadius: 100,
    marginTop: 8,
    marginBottom: 16,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  signInText: {
    fontSize: 14,
    color: "#666",
  },
  signInLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.gray,
  },
});

export default SignUpScreen;
