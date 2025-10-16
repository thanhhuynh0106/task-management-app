import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import AppIcon from "../../components/appIcon";
import Send from "../../../assets/icons/send.svg";
import Attach from "../../../assets/icons/attach.svg";
import Camera from "../../../assets/icons/cam.svg";
import Colors from "../../styles/color";
import Micro from "../../../assets/icons/micro.svg"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

const MessageType = ({ onSendMessage }) => {
  const [message, setMessage] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [tiHeight, setTiHeight] = React.useState(MIN_HEIGH);

  const MIN_HEIGH = 56
  const MAX_HEIGH = 120

  const handleSend = () => {
    const txt = message.trim();
    if (!txt) return;
    onSendMessage?.(txt);
    setMessage("");
    setTiHeight(MIN_HEIGH);
  };

  const pickImage = async () => {
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (mediaLibraryStatus !== 'granted') {
        alert('Sorry, we need camera and media library permissions to make this work!');
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    })

    if (!result.canceled) {
        setImage(result.assets[0].uri);
        console.log(result.assets[0].uri);
    }
  }

  const takePhoto = async () => {
    const { status: cameraStatus} = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraStatus !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
    }

    let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    })

    if (!result.canceled) {
        console.log(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.textInput}
          value={message}
          placeholder="Type a message..."
          placeholderTextColor="#9AA3B2"
          onChangeText={setMessage}
          multiline={true}
          maxLength={300}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <Attach width={20} height={20} style={styles.actionIcon} onPress={pickImage} />
        <Camera width={20} height={20} style={styles.actionIcon} onPress={takePhoto}/>
      </View>
      { message.trim().length > 0 ? (
        <AppIcon
        icon={<Send width={20} height={20} />}
        width={56}
        height={56}
        color={Colors.primary}
        onPress={handleSend}
      />
      ) : (
        <AppIcon
        icon={<Micro width={20} height={20} />}
        width={56}
        height={56}
        color={Colors.primary}
      />
      )}
    </View>
  );
};

export default MessageType;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: Colors.white,
  },
  inputWrap: {
    flex: 1,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.frame,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  actionIcon: {
    marginLeft: 12,
    opacity: 0.65,
  },
  sendBtn: {
    alignSelf: "flex-end",
  },
});
