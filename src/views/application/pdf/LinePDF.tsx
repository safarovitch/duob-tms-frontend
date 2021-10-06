import React from "react";
import {View, StyleSheet} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    root: {
        marginTop: 24,
        marginBottom: 24,
        borderBottomColor: 'black',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1
    }
})

const LinePDF: React.FC = () => <View style={styles.root} />

export default LinePDF
