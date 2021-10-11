import React from "react";
import {View, StyleSheet, Text} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: -48.333,
    },
    signatureContent: {
        marginLeft: 48.333,
    },
    title: {
        width: 150,
        marginBottom: 24,
        fontSize: 10,
        fontWeight: 500
    },
    line: {
        borderBottomColor: 'black',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1
    }
})

const SignaturePDF: React.FC<{signatures: string[]}> = ({signatures}) => (
    <View style={styles.root}>
        {signatures.map((title, index) => (
            <View style={styles.signatureContent} key={index}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.line} />
            </View>
        ))}
    </View>
)

export default SignaturePDF
