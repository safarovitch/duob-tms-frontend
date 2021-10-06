import React from 'react';
import {Font, Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import {IncomeByArticleApplication} from "../../../../model/Application";
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

const IncomeArticlePDF: React.FC<{incomeArticle: IncomeByArticleApplication}> = ({incomeArticle}) => {

    const mainContent = (
        <View>
            <HeaderPDF id={incomeArticle.id!} />
            <View style={styles.details}>
                <View>
                    <Text style={[styles.h4, styles.mb2]}>
                        Приход по статьям
                    </Text>
                    <Text style={styles.body2}>
                        Сумма: {incomeArticle.amount}
                    </Text>
                    <Text style={styles.body2}>
                        Валюта: {incomeArticle.moneyUnit}
                    </Text>
                </View>
                <View>
                    <Text style={[styles.h4, styles.mb2]}>
                        Менеджер
                    </Text>
                    <Text style={styles.body1}>
                        Дата заявки: {incomeArticle.createdDate}
                    </Text>
                </View>
                <View>
                    <Text style={[styles.h4, styles.mb2]}>
                        Коментарии
                    </Text>
                    <Text style={styles.body1}>
                        {incomeArticle.description}
                    </Text>
                </View>
            </View>
            <View style={styles.signatures}>
                <SignaturePDF title={`Менеджер: ${incomeArticle.employeeName}`} />
                <SignaturePDF title={`Кассир:`} />
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

export default IncomeArticlePDF
