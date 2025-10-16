import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import Avatar from "../avatar";
import AppIcon from "../appIcon";
import Message from "../../../assets/icons/message.svg";
import Colors from "../../styles/color";
import Notification from "../../../assets/icons/notification.svg";

const UserHeader = ({ username, usermail, useravatar, navigation }) => {
  const usernameText = username;
  const usermailText = usermail;
  const useravatarImage = useravatar;
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Avatar name={useravatarImage} width={54} height={54} />
        <View style={styles.leftName}>
          <Text style={styles.leftUsername}>{usernameText}</Text>
          <Text style={styles.leftUsermail}>{usermailText}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <AppIcon
          icon={<Message width={16} height={16} />}
          width={40}
          height={40}
          color={Colors.secondary}
          onPress={() => navigation.navigate('Message')}
        />
        <AppIcon
          icon={<Notification width={16} height={16} />}
          width={40}
          height={40}
          color={Colors.secondary}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

export default UserHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    marginBottom: 5,
  },
  left: {
    flexDirection: "row",
  },
  right: {
    flexDirection: "row",
    gap: 12,
    marginRight: 5,
  },
  leftName: {
    marginLeft: 15,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "flex-start",
  },
  leftUsermail: {
    fontSize: 12,
    color: Colors.primary
  },
  leftUsername: {
    fontSize: 16,
    fontWeight: "600",
  }
});
