// src/screens/auth/signInScreen.js
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
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
import PasswordIcon from "../../../assets/icons/password.svg";
import EyeIcon from "../../../assets/icons/eye.svg";
import EyeOffIcon from "../../../assets/icons/eye-off.svg";
import AppButton from "../../components/appButton";
import InputField from "../../components/auth/inputField"
import AuthHeader from "../../components/auth/authHeader";
import { useAuth } from "../../contexts/authContext";
import Colors from "../../styles/color";

const SignInScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Schema validation với Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const { email, password } = data;
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      // TODO: Thêm alert hoặc error message nếu cần
      return;
    }
    // TODO: Implement sign in logic (gọi API để lấy token thực)
    // const token = await api.signIn(trimmedEmail, trimmedPassword);
    const token = "your_auth_token_here"; // Replace with actual token from API
    await signIn(token);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <AuthHeader
          title="Sign In"
          subtitle="Sign in to my account"
          showLogo={true}
        />

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

          <InputField
            name="password"
            icon={PasswordIcon}
            label="Password"
            placeholder="Enter your password"
            control={control}
            error={errors.password}
            secureTextEntry={!showPassword}
            showToggle={true}
            onTogglePress={() => setShowPassword(!showPassword)}
            rightIcon={showPassword ? EyeIcon : EyeOffIcon}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <AppButton
            text="Sign in"
            onPress={handleSubmit(onSubmit)}
            style={styles.signInButton}
            textStyle={styles.signInButtonText}
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signUpLink}>Sign up</Text>
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
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: 8,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  signInButton: {
    width: "100%",
    height: 48,
    borderRadius: 100,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    color: "#666",
  },
  signUpLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
});

export default SignInScreen;
