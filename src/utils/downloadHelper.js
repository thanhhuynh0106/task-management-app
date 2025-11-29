// downloadHelper.js - FIX DIRECT DOWNLOAD ISSUE
import * as FileSystem from 'expo-file-system/legacy';
import { Alert, Platform, Share } from 'react-native';

/**
 * Download file và lưu vào Public Downloads folder (Android) - FIXED VERSION
 */
export const downloadToPublicStorage = async (url, filename) => {
  try {
    console.log('Downloading to public storage:', { url, filename });

    if (Platform.OS === 'android') {
      // Sử dụng Storage Access Framework để lưu vào public storage
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      
      if (!permissions.granted) {
        Alert.alert('Permission Denied', 'Cannot save file without storage permission');
        return await simpleDownload(url, filename); // Fallback
      }

      // LUÔN SỬ DỤNG FALLBACK METHOD - KHÔNG THỬ DIRECT DOWNLOAD
      return await downloadViaCacheFallback(url, filename, permissions.directoryUri);
    } else {
      // iOS: sử dụng cách cũ
      return await simpleDownload(url, filename);
    }
  } catch (error) {
    console.error('Public storage download error:', error);
    // Fallback to simple download
    return await simpleDownload(url, filename);
  }
};

/**
 * Fallback method - download to cache rồi copy sang public storage
 */
const downloadViaCacheFallback = async (url, filename, directoryUri) => {
  try {
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const tempUri = `${FileSystem.cacheDirectory}${safeFilename}`;
    
    console.log('Downloading to cache first:', tempUri);
    
    // Download to cache first
    const downloadResult = await FileSystem.downloadAsync(url, tempUri);
    
    if (downloadResult.status !== 200) {
      throw new Error(`Download failed: ${downloadResult.status}`);
    }

    console.log('Cache download successful, copying to public storage...');

    // Đọc file từ cache dưới dạng base64
    const base64Content = await FileSystem.readAsStringAsync(downloadResult.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Tạo file mới trong thư mục public
    const publicUri = await FileSystem.StorageAccessFramework.createFileAsync(
      directoryUri,
      safeFilename,
      getMimeType(filename)
    );

    console.log('Public file created:', publicUri);

    // Ghi nội dung vào file public
    await FileSystem.writeAsStringAsync(publicUri, base64Content, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('File copied to public storage successfully');

    // Xóa file tạm
    await FileSystem.deleteAsync(tempUri, { idempotent: true });

    Alert.alert(
      'Download Complete', 
      `File saved to Downloads:\n${safeFilename}`,
      [{ text: 'OK' }]
    );

    return publicUri;
  } catch (error) {
    console.error('Cache fallback error:', error);
    
    // Nếu fallback cũng thất bại, xóa file tạm nếu tồn tại
    try {
      const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const tempUri = `${FileSystem.cacheDirectory}${safeFilename}`;
      await FileSystem.deleteAsync(tempUri, { idempotent: true });
    } catch (deleteError) {
      console.error('Error deleting temp file:', deleteError);
    }
    
    throw error; // Re-throw để xử lý ở caller
  }
};

/**
 * Simple download - chỉ lưu trong app cache (nhanh, không cần permission)
 */
export const simpleDownload = async (url, filename) => {
  try {
    console.log('Simple download:', { url, filename });

    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileUri = `${FileSystem.cacheDirectory}${safeFilename}`;

    const downloadResult = await FileSystem.downloadAsync(url, fileUri);

    if (downloadResult.status !== 200) {
      throw new Error(`Download failed: ${downloadResult.status}`);
    }

    Alert.alert(
      'Download Complete', 
      `File saved to app storage:\n${safeFilename}`,
      [{ text: 'OK' }]
    );

    return downloadResult.uri;
  } catch (error) {
    console.error('Simple download error:', error);
    Alert.alert(
      'Download Failed', 
      error.message || 'Cannot download file. Please try again.'
    );
    return null;
  }
};

/**
 * Share file để user có thể chọn nơi lưu
 */
export const shareAndDownload = async (url, filename) => {
  try {
    console.log('Share and download:', { url, filename });

    // Download to cache first
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const tempUri = `${FileSystem.cacheDirectory}${safeFilename}`;
    const downloadResult = await FileSystem.downloadAsync(url, tempUri);

    if (downloadResult.status !== 200) {
      throw new Error(`Download failed: ${downloadResult.status}`);
    }

    // Share file để user chọn nơi lưu
    await Share.share({
      url: downloadResult.uri,
      type: getMimeType(filename),
      title: `Share ${filename}`,
    });

    return downloadResult.uri;
  } catch (error) {
    console.error('Share download error:', error);
    // Fallback to simple download
    return await simpleDownload(url, filename);
  }
};

// Các hàm helper giữ nguyên...
const getMimeType = (filename) => {
  const ext = filename.toLowerCase().split('.').pop();
  const map = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    zip: 'application/zip',
    txt: 'text/plain',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    csv: 'text/csv',
  };
  return map[ext] || 'application/octet-stream';
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export const getFileIconColor = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const colors = {
    pdf: '#FF3B30',
    doc: '#007AFF', docx: '#007AFF',
    xls: '#34C759', xlsx: '#34C759', csv: '#34C759',
    ppt: '#FF9500', pptx: '#FF9500',
    zip: '#AF52DE', rar: '#AF52DE',
    txt: '#8E8E93',
    jpg: '#FF2D55', jpeg: '#FF2D55', png: '#FF2D55', gif: '#FF2D55', webp: '#FF2D55',
  };
  return colors[ext] || '#8E8E93';
};

export { getMimeType };

