import React from 'react';
import {Document, Font, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import {AccountabilityType, mapOfAccountabilityType} from "../../../constants";
import DividerPDF from "../../application/pdf/DividerPDF";
import SignaturePDF from "../../application/pdf/SignaturePDF";
import HeaderPDF from "../../application/pdf/HeaderPDF";
import LinePDF from "../../application/pdf/LinePDF";
import {Accountability} from "../../../model/Employee";

Font.register({
    family: "Roboto",
    fonts: [
        {
            src: '/static/fonts/Roboto/Roboto-Regular.ttf',
            fontStyle: 'normal',
        },
        {
            src: '/static/fonts/Roboto/Roboto-Bold.ttf',
            fontStyle: 'bold'
        }
    ]
});

const styles = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        backgroundColor: '#fff',
    },
    main: {
        paddingVertical: 10,
        paddingHorizontal: 24
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleContainer: {
        width: '250px'
    },
    title: {
        fontSize: 13
    },
    body: {
        fontSize: 10,
        lineHeight: 1.8
    },
    fontBold: {
        fontStyle: 'bold'
    },
    mt: {
        marginTop: 14
    },
    mt1: {
        marginTop: 24
    },
});

const AccountabilityPDF: React.FC<{accountability: Accountability}> = ({accountability}) => {
    const signatures = [
        `Менеджер: ${accountability.createdByName}`,
        `Сотрудник: ${accountability.employeeName}`,
        `Кассир:`
    ]

    const mainContent = (
        <View style={styles.main}>
            <HeaderPDF id={accountability.id!} />
            <View style={[styles.row, styles.mt1]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Дата заявки:
                    </Text>
                </View>
                <View>
                    <Text style={styles.body}>
                        {accountability.updatedDate}
                    </Text>
                </View>
            </View>
            <View style={[styles.row, styles.mt]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Сотрудник:
                    </Text>
                </View>
                <View>
                    <Text style={styles.body}>
                        {accountability.employeeName}
                    </Text>
                </View>
            </View>
            <LinePDF />
            <View style={styles.row}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Подотчет:
                    </Text>
                </View>
                <View>
                    <Text style={styles.body}>
                        {mapOfAccountabilityType.get(AccountabilityType[accountability.type])}
                    </Text>
                    <Text style={[styles.body, styles.fontBold]}>
                        Сумма: {accountability.amount}
                    </Text>
                    <Text style={[styles.body, styles.fontBold]}>
                        Валюта: {accountability.moneyUnit}
                    </Text>
                </View>
            </View>
            <LinePDF />
            <SignaturePDF signatures={signatures} />
        </View>
    )

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {mainContent}
                <DividerPDF/>
                {mainContent}
                <DividerPDF/>
                {mainContent}
            </Page>
        </Document>
    )
}

export default AccountabilityPDF
