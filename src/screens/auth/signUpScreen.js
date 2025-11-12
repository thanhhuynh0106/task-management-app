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

const SignUpScreen = ({ navigation }) => {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email is invalid")
      .required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number is invalid"),
    companyId: Yup.string().required("Company ID is required"),
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
      email: "",
      phone: "",
      companyId: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data) => {
    const { email, phone, companyId, password } = data;
    const userData = {
      email: email.trim(),
      password: password.trim(),
      profile: {
        fullName: email.split("@")[0], // add field fullname later
        employeeId: companyId.trim(), // check this later
        department: null, // add field department later
        position: null
      }
    }
    const result = await signUp(userData);
    if (!result.success) {
      Alert.alert("Error", result.message || "Failed to sign up.");
      return;
    }
  };

  const onInvalid = () => {
    setFocus("email");
  };

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
          <InputField
            name="email"
            icon={EmailIcon}
            label="Email"
            placeholder="mdt@gmail.com"
            control={control}
            error={errors.email}
            keyboardType="email-address"
          />

          <PhoneInputField
            name="phone"
            label="Phone Number"
            control={control}
            error={errors.phone}
          />

          <InputField
            name="companyId"
            icon={CompanyIcon}
            label="Company ID"
            placeholder="1015015"
            control={control}
            error={errors.companyId}
            keyboardType="numeric"
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
});

export default SignUpScreen;
