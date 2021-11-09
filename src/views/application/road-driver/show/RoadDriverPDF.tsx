import React from 'react';
import {Font, Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import {RoadDriverApplicationResponse} from "../../../../model/Application";
import DividerPDF from "../../pdf/DividerPDF";
import SignaturePDF from "../../pdf/SignaturePDF";
import HeaderPDF from "../../pdf/HeaderPDF";
import LinePDF from "../../pdf/LinePDF";
import {mapOfRoadDriverApplicationType} from "../../../../constants";

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

const RoadDriverPDF: React.FC<{roadDriver: RoadDriverApplicationResponse}> = ({roadDriver}) => {
    const signatures = [
        `Менеджер: ${roadDriver.createdByName}`,
        `Водитель: ${roadDriver.driverName}`,
        `Кассир:`
    ]

    const mainContent = (
        <View style={styles.main}>
            <HeaderPDF id={roadDriver.id!} />
            <View style={[styles.row, styles.mt1]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Дата заявки:
                    </Text>
                </View>
                <View>
                    <Text style={styles.body}>
                        {roadDriver.createdDate}
                    </Text>
                </View>
            </View>
            {
                roadDriver.driverId ? (
                    <View style={[styles.row, styles.mt]}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>
                                Водитель:
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.body}>
                                {roadDriver.driverName} #{roadDriver.driverId}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.row, styles.mt]}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>
                                Менеджер:
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.body}>
                                {roadDriver.createdByName} #{roadDriver.createdById}
                            </Text>
                        </View>
                    </View>
                )
            }
            <LinePDF />
            <View style={styles.row}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        {mapOfRoadDriverApplicationType.get(roadDriver.type)}:
                    </Text>
                </View>
                <View>
                    <Text style={styles.body}>
                        {roadDriver.roadId} #{roadDriver.id}
                    </Text>
                    <Text style={[styles.body, styles.fontBold]}>
                        Сумма: {roadDriver.actualAmount}
                    </Text>
                    <Text style={[styles.body, styles.fontBold]}>
                        Валюта: {roadDriver.actualMoneyUnit}
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

export default RoadDriverPDF
