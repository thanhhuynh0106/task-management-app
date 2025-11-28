// //// sharing
// import * as FileSystemLegacy from 'expo-file-system/legacy'; // ← IMPORT LEGACY ĐỂ TRÁNH DEPRECATED
// import * as Sharing from 'expo-sharing';
// import { Alert } from 'react-native';

// /**
//  * Download file – LEGACY API (KHÔNG DEPRECATED WARNING)
//  * @param {string} url - File URL
//  * @param {string} filename - Tên file
//  */
// export const downloadFile = async (url, filename) => {
//   try {
//     // 1. Dùng cacheDirectory từ legacy (luôn tồn tại, không null)
//     const fileUri = `${FileSystemLegacy.cacheDirectory}${encodeURIComponent(filename)}`;

//     // 2. Thông báo tải
//     Alert.alert('Đang tải', `Đang lưu "${filename}"...`, [], { cancelable: false });

//     // 3. Download với LEGACY API (không warning)
//     const downloadResult = await FileSystemLegacy.downloadAsync(url, fileUri);

//     if (downloadResult.status !== 200) {
//       throw new Error('Download failed');
//     }

//     // 4. Share file (UX tốt nhất)
//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(downloadResult.uri, {
//         mimeType: getMimeType(filename),
//         dialogTitle: filename,
//       });
//     } else {
//       Alert.alert('Thành công', `File lưu tại:\n${downloadResult.uri}`);
//     }

//     return downloadResult.uri;
//   } catch (error) {
//     console.error('Download error:', error);
//     Alert.alert('Lỗi', error.message || 'Không thể tải file');
//     return null;
//   }
// };

// /**
//  * Get MIME type (giữ nguyên)
//  */
// const getMimeType = (filename) => {
//   const ext = filename.toLowerCase().split('.').pop();
//   const map = {
//     pdf: 'application/pdf',
//     doc: 'application/msword',
//     docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     xls: 'application/vnd.ms-excel',
//     xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     ppt: 'application/vnd.ms-powerpoint',
//     pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//     zip: 'application/zip',
//     txt: 'text/plain',
//     jpg: 'image/jpeg',
//     png: 'image/png',
//     gif: 'image/gif',
//     webp: 'image/webp',
//   };
//   return map[ext] || 'application/octet-stream';
// };

// /**
//  * Format file size (giữ nguyên)
//  */
// export const formatFileSize = (bytes) => {
//   if (!bytes) return '—';
//   const k = 1024;
//   const sizes = ['B', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
// };

// /**
//  * Get file icon color (giữ nguyên)
//  */
// export const getFileIconColor = (filename) => {
//   const ext = filename.split('.').pop()?.toLowerCase();
//   const colors = {
//     pdf: '#FF3B30',
//     doc: '#007AFF', docx: '#007AFF',
//     xls: '#34C759', xlsx: '#34C759', csv: '#34C759',
//     ppt: '#FF9500', pptx: '#FF9500',
//     zip: '#AF52DE', rar: '#AF52DE',
//     txt: '#8E8E93',
//     jpg: '#FF2D55', jpeg: '#FF2D55', png: '#FF2D55', gif: '#FF2D55', webp: '#FF2D55',
//   };
//   return colors[ext] || '#8E8E93';
// };



import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import { getMimeType } from './downloadHelper'; // Import the function

export const downloadFile = async (url, filename) => {
  try {
    if (Platform.OS === 'android') {
      // === ANDROID: Tự động lưu vào Downloads (không hiện Share) ===
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      
      if (!permissions.granted) {
        Alert.alert('Permission denied', 'Cannot save file');
        return;
      }

      // Tạo file trong thư mục người dùng chọn (thường là Downloads)
      const uri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        getMimeType(filename)
      );

      // Tải và ghi nội dung
      const base64 = await FileSystem.downloadAsync(url, FileSystem.cacheDirectory + 'temp_' + Date.now());
      await FileSystem.StorageAccessFramework.writeAsStringAsync(uri, base64.uri.split(',').pop(), {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert('Thành công', `Đã lưu vào Downloads!\n${filename}`);
      return uri;
    } 

    // === iOS & fallback: Dùng Share Sheet (tốt nhất) ===
    const fileUri = `${FileSystem.cacheDirectory}${encodeURIComponent(filename)}`;
    const result = await FileSystem.downloadAsync(url, fileUri);

    if (result.status !== 200) throw new Error('Download failed');

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(result.uri, {
        mimeType: getMimeType(filename),
        dialogTitle: filename,
      });
    } else {
      Alert.alert('Thành công', `File lưu tại:\n${result.uri}`);
    }

    return result.uri;
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Lỗi', error.message || 'Không thể tải file');
    return null;
  }
};