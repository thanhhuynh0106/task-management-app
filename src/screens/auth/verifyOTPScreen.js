// src/screens/auth/VerifyOTPScreen.js
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SecuritySafeIcon from "../../../assets/icons/security_safe.svg";
import AppButton from "../../components/appButton";
import AuthHeader from "../../components/auth/authHeader";
import Colors from "../../styles/color";

const VerifyOTPScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef([]);

  // Timer for resend code
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter complete 6-digit code");
      return;
    }

    setLoading(true);

    try {
      // TODO: Call API to verify OTP
      // await api.verifyOTP(email, otpCode);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // If OTP is valid, navigate to reset password screen
      navigation.navigate("ResetPassword", { email, otp: otpCode });
    } catch (error) {
      Alert.alert("Error", "Invalid verification code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      // TODO: Call API to resend OTP
      // await api.forgotPassword(email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert("Success", "Verification code has been resent to your email");
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      Alert.alert("Error", "Failed to resend code. Please try again.");
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
            title="Verify Code"
            subtitle={`Enter the 6-digit code sent to ${email}`}
            showLogo={false}
          />
        </View>

        <View style={styles.form}>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[styles.otpInput, digit && styles.otpInputFilled]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <AppButton
            text={loading ? "Verifying..." : "Verify"}
            onPress={handleVerify}
            style={styles.verifyButton}
            textStyle={styles.verifyButtonText}
            disabled={loading || otp.join("").length !== 6}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              color= {Colors.primary}
              style={styles.loader}
            />
          )}

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
              <Text
                style={[
                  styles.resendLink,
                  resendTimer > 0 && styles.resendLinkDisabled,
                ]}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
              </Text>
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
    backgroundColor: "Colors.gray",
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 56,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: Colors.white,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  verifyButton: {
    width: "100%",
    height: 48,
    borderRadius: 100,
    marginTop: 20,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 20,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
  },
  resendLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  resendLinkDisabled: {
    color: Colors.primary,
  },
  headerContainerWithIcon: {
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});

export default VerifyOTPScreen;
