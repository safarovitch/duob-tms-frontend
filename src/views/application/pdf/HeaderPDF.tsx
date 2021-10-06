import React from "react";
import {View, StyleSheet, Text} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
    },
    h1: {
        fontSize: 24,
        fontWeight: 500
    },
    h3: {
        fontSize: 14,
        fontWeight: 500
    },
})

const HeaderPDF: React.FC<{id: number}> = ({id}) => {
    return (
        <View style={styles.root}>
            <View>
                <Text style={styles.h1}>
                    DUOB Logistic
                </Text>
            </View>
            <View>
                <Text style={styles.h3}>
                    ЗАЯВКА #{id}
                </Text>
            </View>
        </View>
    )
}

export default HeaderPDF
