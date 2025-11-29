// components/FileIcon.js - ĐÃ CẬP NHẬT SỬ DỤNG IONICONS
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { View } from 'react-native';

const FileIcon = ({ mimeType, filename, size = 24, color = '#007AFF' }) => {
  const ext = filename?.split('.').pop()?.toLowerCase();
  
  const getIcon = () => {
    // PDF files
    if (mimeType?.includes('pdf') || ext === 'pdf') {
      return <Ionicons name="document-text" size={size} color="#FF3B30" />;
    }
    
    // Word documents
    if (mimeType?.includes('word') || mimeType?.includes('document') || ext === 'doc' || ext === 'docx') {
      return <Ionicons name="document-text" size={size} color="#2B579A" />;
    }
    
    // Excel files
    if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet') || ext === 'xls' || ext === 'xlsx' || ext === 'csv') {
      return <Ionicons name="document-text" size={size} color="#217346" />;
    }
    
    // PowerPoint files
    if (mimeType?.includes('powerpoint') || mimeType?.includes('presentation') || ext === 'ppt' || ext === 'pptx') {
      return <Ionicons name="document-text" size={size} color="#D24726" />;
    }
    
    // Image files
    if (mimeType?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) {
      return <Ionicons name="image" size={size} color="#FF2D55" />;
    }
    
    // Archive files
    if (mimeType?.includes('zip') || mimeType?.includes('rar') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return <Ionicons name="archive" size={size} color="#AF52DE" />;
    }
    
    // Text files
    if (mimeType?.includes('text') || ext === 'txt' || ext === 'log' || ext === 'md') {
      return <Ionicons name="document" size={size} color="#8E8E93" />;
    }
    
    // Audio files
    if (mimeType?.includes('audio') || ['mp3', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) {
      return <Ionicons name="musical-notes" size={size} color="#FF9500" />;
    }
    
    // Video files
    if (mimeType?.includes('video') || ['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext)) {
      return <Ionicons name="videocam" size={size} color="#5856D6" />;
    }
    
    // Default file icon
    return <Ionicons name="document" size={size} color={color} />;
  };

  return (
    <View>
      {getIcon()}
    </View>
  );
};

export default FileIcon;