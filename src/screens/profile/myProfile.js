// File: myProfile.js (Updated with proper state management, mock data, and navigation hooks)
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ClickChange from '../../components/profile/clickChange';
import ViewInf from '../../components/profile/viewInf';
import Colors from "../../styles/color";

// Import SVG icons
import { SafeAreaView } from 'react-native-safe-area-context';
import Back from "../../../assets/icons/back.svg";
import Folder from "../../../assets/icons/folder.svg";
import Location from "../../../assets/icons/location-tick.svg";
import LogoutIcon from "../../../assets/icons/logout.svg";
import Faq from "../../../assets/icons/message-text.svg";
import Payroll from "../../../assets/icons/money.svg";
import Code from "../../../assets/icons/scroll.svg";
import Key from "../../../assets/icons/setting-2.svg";
import Mail from "../../../assets/icons/sms.svg";
import Person from "../../../assets/icons/user.svg";
// Import ảnh đại diện
import ProfilePic from "../../../assets/images/icon.png";

const AVATAR_SIZE = 90 
const OVERLAP_PERCENT = 0.2 

const MyProfile = () => {
  const navigation = useNavigation(); // Use navigation

  // Mockup data and state management
  const [profileData, setProfileData] = React.useState({
    name: 'Tonald Drump',
    position: 'Junior Full Stack Developer',
    email: 'Tonald@gmail.com',
    location: 'Taman Anggrek',
  });

  // Tính toán vị trí avatar theo % header height
  const { avatarTop, headerHeight } = useMemo(() => {
    const headerH = 150 
    const overlapHeight = AVATAR_SIZE * OVERLAP_PERCENT
    const top = headerH - overlapHeight // 50% trong header → top = headerH * 0.5
    return { avatarTop: top, headerHeight: headerH }
  }, [])

  const avatarStyle = {
    ...styles.avatar,
    top: avatarTop,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ScrollView>

      
      <View style={[styles.header, { height: headerHeight }]}>
        <Pressable         
          onPress={() => navigation.goBack()} // Added goBack navigation
          style={styles.backButton}>
          <Back width={24} height={24} fill="white" />
        </Pressable>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Avatar  */}
      <Image source={ProfilePic} style={avatarStyle} />

      {/* Nội dung */}
      <View style={[styles.content, { paddingTop: AVATAR_SIZE * (1 - OVERLAP_PERCENT) + 16 }]}>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profileData.name}</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
          <Text style={styles.position}>{profileData.position}</Text>
        </View>

        {/* CONTACT */}
        <Text style={styles.sectionHeader}>CONTACT</Text>
        <View style={styles.section}>
          <ViewInf icon={<Mail width={20} height={20} style={styles.inputIcon} />} title={profileData.email} />
          <ViewInf icon={<Location width={20} height={20} style={styles.inputIcon} />} title={profileData.location} />
        </View>

        {/* ACCOUNT */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.section}>
          <ClickChange icon={<Person width={20} height={20} style={styles.inputIcon} />} title="Personal Data" onPress={() => navigation.navigate('PersonalData')} />
          <ClickChange icon={<Folder width={20} height={20} style={styles.inputIcon} />} title="Office Assets" onPress={() => navigation.navigate('OfficeAssets')} />
          <ClickChange icon={<Payroll width={20} height={20} style={styles.inputIcon} />} title="Payroll & Tax" onPress={() => navigation.navigate('PayrollAndTax')} />
        </View>

        {/* SETTINGS */}
        <Text style={styles.sectionHeader}>SETTINGS</Text>
        <View style={styles.section}>
          <ClickChange icon={<Key width={20} height={20} style={styles.inputIcon} />} title="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
          <ClickChange icon={<Code width={20} height={20} style={styles.inputIcon} />} title="Versioning" onPress={() => {}} />
          <ClickChange icon={<Faq width={20} height={20} style={styles.inputIcon} />} title="FAQ and Help" onPress={() => {}} />
          <ClickChange
            icon={<LogoutIcon width={20} height={20} style={[styles.inputIcon, { tintColor: '#FF3B30' }]} />}
            title="Logout"
            onPress={() => {}}
          />
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MyProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: Colors.primary || '#6B4EFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',

  },
  avatar: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
    borderWidth: 4,
    borderColor: Colors.borderGray,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    // paddingTop sẽ được tính động
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 8,
  },
  verifiedBadge: {
    backgroundColor: '#E6E0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.primary || '#6B4EFF',
    fontWeight: '600',
  },
  position: {
    fontSize: 15,
    color: '#666',
    marginTop: 6,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#888',
    textTransform: 'uppercase',
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  section: {
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 12,
    tintColor: Colors.primary || '#6B4EFF',
  },
})