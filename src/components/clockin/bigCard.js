import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../styles/color'
import SmallCard from './smallCard'

const BigCard = ({day, totalHours, inOutTime}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.dayText}>{day}</Text>
            <SmallCard totalHours={totalHours} inOutTime={inOutTime}/>            
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
