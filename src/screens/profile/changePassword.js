// File: changePassword.js (Updated with proper state management and mock data)
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../../components/appButton';
import HeaderWithBackButton from '../../components/headerWithBackButton';
import Colors from "../../styles/color";
// Import icons (assuming paths based on previous patterns)
import EyeOff from "../../../assets/icons/eye-slash.svg";
import Lock from "../../../assets/icons/finger-scan.svg";
import Eye from "../../../assets/icons/Property 1=linear.svg";

// Reusable PasswordInput component for the three similar inputs
const PasswordInput = ({ label, placeholder, value, onChangeText }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={passwordStyles.container}>
      <Text style={passwordStyles.label}>{label}</Text>
      <View style={passwordStyles.inputContainer}>
        <Lock width={20} height={20} style={passwordStyles.lockIcon} />
        <TextInput
          style={passwordStyles.input}
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          placeholderTextColor="#A0A0A0"
          value={value}
          onChangeText={onChangeText}
        />
        <Pressable 
          onPress={() => setShowPassword(!showPassword)} 
          style={passwordStyles.eyeButton}
        >
          {showPassword ? (
            <Eye width={20} height={20} />
          ) : (
            <EyeOff width={20} height={20} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const passwordStyles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0FF',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
  },
  lockIcon: {
    marginRight: 12,
    tintColor: Colors.primary,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  eyeButton: {
    padding: 10,
  },
});

const ChangePassword = () => {
  // Mockup data and state management
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    // Mock update logic (e.g., validate and log)
    if (formData.newPassword !== formData.confirmNewPassword) {
      console.log('Passwords do not match');
      return;
    }
    console.log('Password updated:', formData);
  };

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <HeaderWithBackButton 
        title="Personal Data" 
        onBackPress={() => navigation.goBack()} // Added goBack navigation
      />
      
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Change Password Form</Text>
        <Text style={styles.formSubtitle}>Fill information to change your password</Text>
        
        <PasswordInput 
          label="Current Password" 
          placeholder="My Password" 
          value={formData.currentPassword}
          onChangeText={(text) => handleChange('currentPassword', text)}
        />
        <PasswordInput 
          label="New Password" 
          placeholder="My Password" 
          value={formData.newPassword}
          onChangeText={(text) => handleChange('newPassword', text)}
        />
        <PasswordInput 
          label="Confirm New Password" 
          placeholder="My Password" 
          value={formData.confirmNewPassword}
          onChangeText={(text) => handleChange('confirmNewPassword', text)}
        />
      </View>
      <View style={styles.bottom}>
        <AppButton 
            text="Update Password" 
            onPress={handleUpdate}
            style={{
                width: "95%",
                height: 47,
                marginTop: 16,
              }}
            textStyle={{ fontSize: 15 }}

        />
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  updateButton: {
    width: '90%',
    height: 50,
    borderRadius: 25,
    marginTop: 'auto',
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },

});