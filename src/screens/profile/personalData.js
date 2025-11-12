// screens/personalData.js
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../components/appButton';
import HeaderWithBackButton from '../../components/headerWithBackButton';
import Colors from '../../styles/color';

// Icons
import Calendar from '../../../assets/icons/calendar-2.svg';
import ChevronDown from '../../../assets/icons/chevron_down.svg';
import ChevronLeft from '../../../assets/icons/chevron_left.svg';
import ChevronRight from '../../../assets/icons/chevron_right.svg';
import PositionIcon from '../../../assets/icons/keyboard.svg';
import LocationIcon from '../../../assets/icons/location-tick.svg';
import UploadIcon from '../../../assets/icons/upload.svg';
import UserIcon from '../../../assets/icons/user.svg';

// Image
import ProfileImage from '../../../assets/images/icon.png';

const PersonalData = () => {
  const navigation = useNavigation();

  // --- Form Data ---
  const [formData, setFormData] = useState({
    firstName: 'Tonald',
    lastName: 'Drump',
    dateOfBirth: '19 December 1997',
    position: 'Junior Full Stack Developer',
    country: '',
    state: '',
    city: '',
    fullAddress: '',
  });

  // --- Calendar ---
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempDate, setTempDate] = useState(null);

  // --- Select Modal ---
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectModalData, setSelectModalData] = useState({ field: '', title: '', items: [], tempValue: null });

  // --- MOCK DATA (Country → State → City) ---
  const locationData = {
    Indonesia: {
      'DKI Jakarta': ['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Barat', 'Jakarta Utara', 'Jakarta Timur'],
      'Jawa Barat': ['Bandung', 'Bogor', 'Bekasi', 'Depok'],
      'Bali': ['Denpasar', 'Badung', 'Gianyar'],
    },
    Singapore: {
      'Central Region': ['Bukit Merah', 'Downtown Core', 'Marina South'],
      'North Region': ['Woodlands', 'Yishun', 'Sembawang'],
    },
    Malaysia: {
      'Kuala Lumpur': ['Kuala Lumpur City', 'Petaling Jaya'],
      'Penang': ['George Town', 'Bayan Lepas'],
      'Johor': ['Johor Bahru', 'Iskandar Puteri'],
    },
    Thailand: {
      'Bangkok': ['Bangkok Noi', 'Phaya Thai', 'Pathum Wan'],
      'Chiang Mai': ['Mueang Chiang Mai', 'San Sai'],
    },
    Vietnam: {
      'Hà Nội': ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa'],
      'TP. Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh'],
      'Đà Nẵng': ['Hải Châu', 'Thanh Khê'],
    },
  };

  const countries = Object.keys(locationData);
  const positions = [
    'Junior Full Stack Developer',
    'Senior Frontend Engineer',
    'Backend Developer',
    'Mobile Developer',
    'UI/UX Designer',
  ];

  // --- Get States by Country ---
  const getStates = (country) => {
    return country ? Object.keys(locationData[country] || {}) : [];
  };

  // --- Get Cities by Country + State ---
  const getCities = (country, state) => {
    return country && state ? locationData[country]?.[state] || [] : [];
  };

  // --- Open Select Modal ---
  const openSelectModal = (field, items, title) => {
    const currentValue = formData[field];
    setSelectModalData({
      field,
      title,
      items,
      tempValue: currentValue,
    });
    setShowSelectModal(true);
  };

  const confirmSelect = () => {
    if (selectModalData.tempValue) {
      const newData = { [selectModalData.field]: selectModalData.tempValue };

      // Reset khi đổi Country/State
      if (selectModalData.field === 'country') {
        newData.state = '';
        newData.city = '';
      } else if (selectModalData.field === 'state') {
        newData.city = '';
      }

      setFormData(prev => ({ ...prev, ...newData }));
      setShowSelectModal(false);
    }
  };

  // --- Calendar: Mở đúng ngày từ formData ---
  const openCalendar = () => {
    const dateStr = formData.dateOfBirth;
    let parsedDate = new Date();

    if (dateStr) {
      const parts = dateStr.split(' ');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthIndex = monthNames.findIndex(m => m.toLowerCase().startsWith(parts[1].toLowerCase()));
        const year = parseInt(parts[2], 10);

        if (!isNaN(day) && monthIndex >= 0 && !isNaN(year)) {
          parsedDate = new Date(year, monthIndex, day);
          if (isNaN(parsedDate.getTime())) parsedDate = new Date();
        }
      }
    }

    setTempDate(parsedDate);
    setCurrentMonth(new Date(parsedDate.getFullYear(), parsedDate.getMonth()));
    setShowCalendarModal(true);
  };

  const confirmDate = () => {
    if (tempDate && !isNaN(tempDate.getTime())) {
      setFormData(prev => ({ ...prev, dateOfBirth: formatDate(tempDate) }));
      setShowCalendarModal(false);
    }
  };

  // --- Helper ---
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isSameDay = (d1, d2) => d1 && d2 && d1.toDateString() === d2.toDateString();

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  // --- Render Selector ---
  const renderSelector = (label, value, placeholder, onPress, Icon) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <TouchableOpacity style={styles.selector} onPress={onPress}>
        <View style={styles.selectorLeft}>
          <Icon width={20} height={20} />
          <Text style={[styles.selectorText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
        </View>
        <ChevronDown width={20} height={20} />
      </TouchableOpacity>
    </View>
  );

  // --- Render Bottom Modal ---
  const renderBottomModal = (visible, onClose, onConfirm, items, selected, onSelect, title) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <View style={styles.modalDivider} />
          </View>
          <FlatList
            data={items}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modalItem, selected === item && styles.modalItemSelected]}
                onPress={() => onSelect(item)}
              >
                <Text style={[styles.itemName, selected === item && styles.itemNameSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.modalButtonClose]} onPress={onClose}>
              <Text style={styles.modalButtonTextClose}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonConfirm, !selected && styles.modalButtonDisabled]}
              onPress={onConfirm}
              disabled={!selected}
            >
              <Text style={styles.modalButtonTextConfirm}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  // --- Render Calendar Modal ---
  const renderCalendarModal = () => (
    <Modal visible={showCalendarModal} transparent animationType="slide" onRequestClose={() => setShowCalendarModal(false)}>
      <Pressable style={styles.modalOverlay} onPress={() => setShowCalendarModal(false)}>
        <Pressable style={styles.calendarModalContent} onPress={e => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <View style={styles.modalDivider} />
          </View>

          <View style={styles.calendarHeader}>
            <Calendar width={20} height={20} />
            <TouchableOpacity onPress={prevMonth} style={styles.monthButton}>
              <ChevronLeft width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.monthButton}>
              <ChevronRight width={24} height={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {getDaysInMonth(currentMonth).map((date, index) => {
              const isSelected = date && isSameDay(date, tempDate);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.calendarDay, !date && styles.emptyDay, isSelected && styles.selectedDay]}
                  onPress={() => date && setTempDate(date)}
                  disabled={!date}
                >
                  {date && (
                    <Text style={[styles.calendarDayText, isSelected && styles.selectedDayText]}>
                      {date.getDate()}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {tempDate && (
            <View style={styles.selectedDatesInfo}>
              <Text style={styles.selectedDatesText}>{formatDate(tempDate)}</Text>
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.modalButtonClose]} onPress={() => setShowCalendarModal(false)}>
              <Text style={styles.modalButtonTextClose}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonConfirm, !tempDate && styles.modalButtonDisabled]}
              onPress={confirmDate}
              disabled={!tempDate}
            >
              <Text style={styles.modalButtonTextConfirm}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBackButton title="Personal Data" onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <Text style={styles.formTitle}>My Personal Data</Text>
            <Text style={styles.formSubtitle}>Details about my personal data</Text>

            <View style={styles.photoContainer}>
              <Image source={ProfileImage} style={styles.profileImage} />
              <Pressable style={styles.uploadButton}>
                <UploadIcon width={20} height={20} fill={Colors.primary} />
              </Pressable>
              <Text style={styles.photoText}>Upload Photo</Text>
              <Text style={styles.photoSubtitle}>Format should be in .jpg, .png and less than 5MB</Text>
            </View>

            {/* First & Last Name */}
            <View style={styles.selectorContainer}>
              <Text style={styles.selectorLabel}>First Name</Text>
              <View style={styles.inputContainer}>
                <UserIcon width={20} height={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={t => setFormData(prev => ({ ...prev, firstName: t }))}
                  placeholder="Enter first name"
                />
              </View>
            </View>

            <View style={styles.selectorContainer}>
              <Text style={styles.selectorLabel}>Last Name</Text>
              <View style={styles.inputContainer}>
                <UserIcon width={20} height={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={t => setFormData(prev => ({ ...prev, lastName: t }))}
                  placeholder="Enter last name"
                />
              </View>
            </View>

            {/* Date of Birth */}
            {renderSelector(
              'Date of Birth',
              formData.dateOfBirth,
              'Select date',
              openCalendar,
              Calendar
            )}

            {/* Position */}
            {renderSelector(
              'Position',
              formData.position,
              'Select position',
              () => openSelectModal('position', positions, 'Select Position'),
              PositionIcon
            )}

            <Text style={styles.formTitle}>Address</Text>
            <Text style={styles.formSubtitle}>Your current domicile</Text>

            {/* Country */}
            {renderSelector(
              'Country',
              formData.country,
              'Select country',
              () => openSelectModal('country', countries, 'Select Country'),
              LocationIcon
            )}

            {/* State */}
            {renderSelector(
              'State/Province',
              formData.state,
              'Select state',
              () => openSelectModal('state', getStates(formData.country), 'Select State'),
              LocationIcon
            )}

            {/* City */}
            {renderSelector(
              'City/Locality',
              formData.city,
              'Select city',
              () => openSelectModal('city', getCities(formData.country, formData.state), 'Select City'),
              LocationIcon
            )}

            {/* Full Address */}
            <View style={styles.selectorContainer}>
              <Text style={styles.selectorLabel}>Full Address</Text>
              <TextInput
                style={[styles.textInput, styles.textInputMultiline]}
                value={formData.fullAddress}
                onChangeText={t => setFormData(prev => ({ ...prev, fullAddress: t }))}
                placeholder="Enter full address..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.submitButtonContainer}>
        <AppButton
          text="Update"
          onPress={() => console.log('Updated:', formData)}
          style={styles.submitButton}
          textStyle={styles.submitButtonText}
        />
      </View>

      {/* Select Modal */}
      {renderBottomModal(
        showSelectModal,
        () => setShowSelectModal(false),
        confirmSelect,
        selectModalData.items,
        selectModalData.tempValue,
        (item) => setSelectModalData(prev => ({ ...prev, tempValue: item })),
        selectModalData.title
      )}

      {/* Calendar Modal */}
      {renderCalendarModal()}
    </SafeAreaView>
  );
};

export default PersonalData;

// === STYLES (giữ nguyên) ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollView: { flex: 1, backgroundColor: Colors.secondary },
  scrollViewContent: { padding: 16 },
  contentWrapper: { backgroundColor: Colors.white, borderRadius: 12, padding: 16 },
  content: { gap: 20 },
  formTitle: { fontSize: 20, fontWeight: '700', color: '#000000', textAlign: 'center' },
  formSubtitle: { fontSize: 16, color: '#475467', textAlign: 'center', marginBottom: 24 },
  photoContainer: { alignItems: 'center', marginBottom: 24 },
  profileImage: { width: 100, height: 100, borderRadius: 12, marginBottom: 8 },
  uploadButton: { position: 'absolute', bottom: 80, right: '40%', backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 3 },
  photoText: { fontSize: 16, fontWeight: '600', color: Colors.primary, marginBottom: 4 },
  photoSubtitle: { fontSize: 12, color: '#888', textAlign: 'center' },

  selectorContainer: { gap: 8 },
  selectorLabel: { fontSize: 16, fontWeight: '600', color: '#000000' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: '#000', fontWeight: '500' },
  selector: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  selectorLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  selectorText: { fontSize: 15, color: '#000000', fontWeight: '500', flex: 1 },
  placeholderText: { color: '#999999', fontWeight: '400' },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  textInputMultiline: { minHeight: 100, paddingTop: 16 },

  submitButtonContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  submitButton: { width: '100%', height: 50, borderRadius: 25 },
  submitButtonText: { fontSize: 16, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%' },
  calendarModalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
  modalHeader: { padding: 20, paddingBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#000000', textAlign: 'center' },
  modalDivider: { height: 1, backgroundColor: '#E8E8E8', marginTop: 16 },
  modalItem: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  modalItemSelected: { backgroundColor: '#F4F3FF' },
  itemName: { fontSize: 16, fontWeight: '500', color: '#000000' },
  itemNameSelected: { color: Colors.primary, fontWeight: '600' },
  modalButtons: { flexDirection: 'row', gap: 12, padding: 20, paddingTop: 16 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modalButtonClose: { backgroundColor: '#F5F5F5' },
  modalButtonConfirm: { backgroundColor: Colors.primary },
  modalButtonDisabled: { backgroundColor: '#CCCCCC' },
  modalButtonTextClose: { fontSize: 16, fontWeight: '600', color: '#666666' },
  modalButtonTextConfirm: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

  // Calendar
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  monthButton: { padding: 8 },
  monthText: { fontSize: 18, fontWeight: '600', color: '#000000' },
  weekDays: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12 },
  weekDayText: { flex: 1, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#666666' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, paddingBottom: 20 },
  calendarDay: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 4 },
  emptyDay: { backgroundColor: 'transparent' },
  selectedDay: { backgroundColor: Colors.primary, borderRadius: 8 },
  calendarDayText: { fontSize: 15, color: '#000000', fontWeight: '500' },
  selectedDayText: { color: '#FFFFFF', fontWeight: '700' },
  selectedDatesInfo: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#F4F3FF', marginHorizontal: 20, borderRadius: 8, marginBottom: 12 },
  selectedDatesText: { fontSize: 15, fontWeight: '600', color: Colors.primary, textAlign: 'center' },
});