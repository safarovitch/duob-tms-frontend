import React from 'react';
import {Font, Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import {RefillBalanceApplication} from "../../../../model/Application";
import {Currency, mapOfActionTypeApplication} from "../../../../constants";
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

const RefillBalancePDF: React.FC<{refillBalance: RefillBalanceApplication}> = ({refillBalance}) => {
    const signatures = [
        `Менеджер: ${refillBalance.createdBy?.name}`,
        `Клиент: ${refillBalance.client?.name}`,
        `Кассир:`
    ]

    const mainContent = (
        <View style={styles.main}>
            <HeaderPDF id={refillBalance.id!} />
            <View style={[styles.row, styles.mt1]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Дата заявки:
                    </Text>
                </View>
                <View>
                    <Text style={styles.body}>
                        {refillBalance.createdDate}
                    </Text>
                </View>
            </View>
            <View style={[styles.row, styles.mt]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Клиент:
                    </Text>
                </View>
                <View>
                    <Text style={styles.body}>
                        {refillBalance.client?.name} #{refillBalance.client?.id}
                    </Text>
                </View>
            </View>
            <LinePDF />
            <View style={styles.row}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            {mapOfActionTypeApplication.get(refillBalance.actionType)}:
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.body}>
                            Сумма: {`${refillBalance.actualAmount} ${refillBalance.actualMoneyUnit}`}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {`${refillBalance.convertAmount} ${refillBalance.convertMoneyUnit}`}
                        </Text>
                        <Text style={styles.body}>
                            Курс конвертации: {refillBalance.currency}
                        </Text>
                        <Text style={[styles.body, styles.fontBold]}>
                            Итого: {refillBalance.totalAmount} {Currency.USD}
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

export default RefillBalancePDF
