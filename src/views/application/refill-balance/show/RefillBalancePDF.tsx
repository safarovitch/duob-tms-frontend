import React from 'react';
import {Font, Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import {RefillBalanceApplication} from "../../../../model/Application";
import {mapOfActionTypeApplication} from "../../../../constants";
import DividerPDF from "../../pdf/DividerPDF";
import SignaturePDF from "../../pdf/SignaturePDF";
import HeaderPDF from "../../pdf/HeaderPDF";

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
        padding: 24
    },
    h4: {
        fontSize: 14,
        fontWeight: 500
    },
    body1: {
        fontSize: 10,
        lineHeight: 1.8
    },
    body2: {
        fontSize: 10,
        lineHeight: 1.8,
        fontStyle: 'bold'
    },
    mb2: {
        marginBottom: 8
    },
    details: {
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    signatures: {
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    divider: {
        marginBottom: 32,
        marginTop: 32
    }
});

const RefillBalancePDF: React.FC<{refillBalance: RefillBalanceApplication}> = ({refillBalance}) => {

    const mainContent = (
        <View>
            <HeaderPDF id={refillBalance.id!} />
            <View style={styles.details}>
                <View>
                    <Text style={[styles.h4, styles.mb2]}>
                        {mapOfActionTypeApplication.get(refillBalance.actionType)}
                    </Text>
                    <Text style={styles.body1}>
                        Сумма: {`${refillBalance.amount} ${refillBalance.moneyUnit}`}
                    </Text>
                    <Text style={styles.body1}>
                        Курс конвертации: {refillBalance.currency}
                    </Text>
                    <Text style={styles.body2}>
                        Итого: {refillBalance.totalUSD} $
                    </Text>
                </View>
                <View>
                    <Text style={[styles.h4, styles.mb2]}>
                        Клиент
                    </Text>
                    <Text style={styles.body1}>
                        Идентификатор клиента: #{refillBalance.client?.id}
                    </Text>
                    <Text style={styles.body1}>
                        Дата заявки: {refillBalance.createdDate}
                    </Text>
                </View>
                <View>
                    <Text style={[styles.h4, styles.mb2]}>
                        Коментарии
                    </Text>
                    <Text style={styles.body1}>
                        {refillBalance.description}
                    </Text>
                </View>
            </View>
            <View style={styles.signatures}>
                <SignaturePDF title={`Менеджер: ${refillBalance.employeeName}`} />
                <SignaturePDF title={`Клиент: ${refillBalance.client?.name}`} />
                <SignaturePDF title={`Кассир: ${refillBalance.casherName}`} />
            </View>
        </View>
    )

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {mainContent}
                <View style={styles.divider}>
                    <DividerPDF/>
                </View>
                {mainContent}
            </Page>
        </Document>
    )
}

export default RefillBalancePDF
