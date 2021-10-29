import React from 'react';
import {Font, Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import {OutcomeTransferWarehouseApplication} from "../../../../model/Application";
import DividerPDF from "../../pdf/DividerPDF";
import SignaturePDF from "../../pdf/SignaturePDF";
import HeaderPDF from "../../pdf/HeaderPDF";
import LinePDF from "../../pdf/LinePDF";

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
        paddingVertical: 14,
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

const OutcomeTransferWarehousePDF: React.FC<{outcomeTransferWarehouse: OutcomeTransferWarehouseApplication}> = ({outcomeTransferWarehouse}) => {
    const signatures = [
        `Менеджер: ${outcomeTransferWarehouse.createdBy?.name}`,
        `Кассир отправителя:`,
        `Кассир получателя:`
    ]

    const mainContent = (
        <View style={styles.main}>
            <HeaderPDF id={outcomeTransferWarehouse.id!} />
            <View style={[styles.row, styles.mt1]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Дата заявки:
                    </Text>
                </View>
                <View>
                    <Text style={styles.body}>
                        {outcomeTransferWarehouse.createdDate}
                    </Text>
                </View>
            </View>
            <View style={[styles.row, styles.mt]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Склад:
                    </Text>
                </View>
                <View>
                    <Text style={styles.body}>
                        {`${outcomeTransferWarehouse.toWarehouse?.name} #${outcomeTransferWarehouse.toWarehouse?.id}`}
                    </Text>
                </View>
            </View>
            <LinePDF />
            <View style={styles.row}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Перевод денег:
                    </Text>
                </View>
                <View>
                    <Text style={[styles.body, styles.fontBold]}>
                        Сумма: {outcomeTransferWarehouse.actualAmount}
                    </Text>
                    <Text style={[styles.body, styles.fontBold]}>
                        Валюта: {outcomeTransferWarehouse.actualMoneyUnit}
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

export default OutcomeTransferWarehousePDF
