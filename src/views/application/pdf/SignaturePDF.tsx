import React from "react";
import {View, StyleSheet, Text} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    title: {
        minWidth: '100px',
        fontSize: 10,
        fontWeight: 500,
        marginBottom: 20
    },
    line: {
        borderBottomColor: 'black',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1
    }
})

const SignaturePDF: React.FC<{title: string}> = ({title}) => {
    return (
        <View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.line} />
        </View>
    )
}

export default SignaturePDF
