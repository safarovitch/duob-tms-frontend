import React from "react";
import {View, StyleSheet, Text, Image} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
    },
    brandContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    brandLogo: {
        height: 50,
        width: 50
    },
    titleContent: {
        marginLeft: '10px'
    },
    title: {
        fontSize: 24,
        fontWeight: 500
    },
    subTitle: {
        marginLeft: 17,
        fontSize: 18,
        fontWeight: 500
    },
    applicantId: {
        fontSize: 12,
        fontWeight: 500
    }
})

const HeaderPDF: React.FC<{id: number}> = ({id}) => {
    return (
        <View style={styles.root}>
            <View style={styles.brandContent}>
                <Image
                    source="/static/logoPDF.png"
                    style={styles.brandLogo}
                />
                <View style={styles.titleContent}>
                    <Text style={styles.title}>
                        DUOB
                    </Text>
                    <Text style={styles.subTitle}>
                        Logistic
                    </Text>
                </View>
            </View>
            <View>
                <Text style={styles.applicantId}>
                    ЗАЯВКА #{id}
                </Text>
            </View>
        </View>
    )
}

export default HeaderPDF
