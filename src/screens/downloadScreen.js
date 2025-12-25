import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { downloadFile } from '../utils/downloadHelper';

const DownloadScreen = () => {
    const [url, setUrl] = useState('');
    const [filename, setFilename] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        if (!url) return Alert.alert('Lỗi', 'Nhập URL đi!');
        if (!filename) return Alert.alert('Lỗi', 'Nhập tên file đi!');

        const fileExtension = url.split('.').pop().split('?')[0];
        const fullFilename = filename.includes('.') ? filename : `${filename}.${fileExtension}`;

        setIsLoading(true); // Bắt đầu hiển thị màn hình loading
        try {
            await downloadFile(url, fullFilename);
            Alert.alert('Thành công', 'Tải file thành công!');
        } catch (error) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải file.');
        } finally {
            setIsLoading(false); // Tắt màn hình loading
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <TextInput
                        placeholder="Nhập URL file (ví dụ: https://example.com/file.pdf)"
                        value={url}
                        onChangeText={setUrl}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Tên file (ví dụ: report)"
                        value={filename}
                        onChangeText={setFilename}
                        style={styles.input}
                    />
                    <Button title="Tải về ngay!" onPress={handleDownload} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#fff',
    },
});

export default DownloadScreen;
