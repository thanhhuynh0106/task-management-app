import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../styles/color'
import SmallCard from './smallCard'

const BigCard = ({day}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.dayText}>{day}</Text>
            <SmallCard totalHours={"08:00 hrs"} inOutTime={"09:00 AM - 05:30 PM"}/>            
        </View>
    )
}

export default BigCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    dayText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 12,
    },
})
