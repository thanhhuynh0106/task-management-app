import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../../styles/color"

const SmallCard = ({totalHours, inOutTime}) => {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Text style={styles.topText}>Total hours</Text>
                <Text style={styles.bottomText}>{totalHours}</Text>
            </View>
            <View style={styles.right}>
                <Text style={styles.topText}>Clock-in & out</Text>
                <Text style={styles.bottomText}>{inOutTime}</Text>
            </View>
        </View>
    )
}

export default SmallCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.gray,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.borderGray,
        flexDirection: 'row',
    },
    left: {
        flex: 1,
        padding: 12,
    },
    right: {
        flex: 1,
        padding: 12,
    },
    topText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#535353ff',
    },
    bottomText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000',
        marginTop: 4,
    },
})
