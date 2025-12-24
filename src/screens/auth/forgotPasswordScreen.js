import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import EmailIcon from "../../../assets/icons/email.svg";
import SecuritySafeIcon from "../../../assets/icons/security_safe.svg";
import AppButton from "../../components/appButton";
import AuthHeader from "../../components/auth/authHeader";
import InputField from "../../components/auth/inputField";
import AppColors from "../../styles/color";

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
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.topSection} />

        <View style={styles.bottomSheet}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                bounces={false}
              >
                <View style={styles.iconContainer}>
                  <SecuritySafeIcon width={60} height={60} />
                </View>

                <AuthHeader
                  title="Forgot Password"
                  subtitle="Enter your email to receive a verification code"
                  showLogo={false}
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
                    containerStyle={styles.inputContainer}
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
                      color={AppColors.primary}
                      style={styles.loader}
                    />
                  )}

                  <View style={styles.backToSignInContainer}>
                    <Text style={styles.backToSignInText}>
                      Remember your password?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("SignIn")}
                    >
                      <Text style={styles.backToSignInLink}>Sign in</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1E1E2E",
  },
  container: {
    flex: 1,
    backgroundColor: "#1E1E2E",
  },
  topSection: {
    height: "25%",
    backgroundColor: "#1E1E2E",
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    marginTop: -20,
    overflow: "hidden",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  form: {
    flex: 1,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  submitButton: {
    width: "100%",
    height: 52,
    borderRadius: 26,
    backgroundColor: AppColors.primary,
    marginTop: 20,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
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
    color: "#888888",
  },
  backToSignInLink: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;
