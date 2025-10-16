import React from "react";
import { StyleSheet, View } from "react-native";
import { AvatarMap, DefaultAvatar } from "../utils/avatarMapping";

const Avatar = ({name, width, height}) => {
  const key = name 
  const widthAvatar = width
  const heightAvatar = height
  const Svg = AvatarMap[key] || DefaultAvatar

    return (
        <View style={[styles.avatar, {width: widthAvatar, height: heightAvatar, borderRadius: widthAvatar / 2}]}>
            <Svg width={widthAvatar} height={heightAvatar} />
        </View>
    );
}

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
  }
});