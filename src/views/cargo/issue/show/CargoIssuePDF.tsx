import React from 'react';
import {Font, Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import {CargoIssueResponse} from "../../../../model/Cargo";
import HeaderPDF from "../../../application/pdf/HeaderPDF";

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
        alignContent: 'center',
        justifyContent: 'space-between'
    },
    col: {
        flexDirection: 'row',
        alignContent: 'center',
    },
    titleContainer: {
        marginRight: 10
    },
    title: {
        fontSize: 12
    },
    body: {
        fontSize: 11,
        lineHeight: 1.8
    },
    fontBold: {
        fontStyle: 'bold'
    },
    mt: {
        marginTop: 10
    },
    mt1: {
        marginTop: 30
    },
    mt2: {
        marginTop: 20
    },
    table: {
        width: 'auto',
    },
    tableRow: {
        margin: 'auto',
        paddingVertical: 5,
        flexDirection: 'row',
        borderStyle: "solid",
        borderBottom: 1,
    },
    tableData: {
        width: '24%',
    },
    tableDataId: {
        width: '4%',
    },
    tableText: {
        margin: 'auto',
        marginTop: 5,
        fontSize: 9,
    },
});

interface CargoIssuePrint {
    type: string;
    lengthCargo: number;
    widthCargo: number;
    heightCargo: number;
    totalVolume: number;
    wightCargo: number;
}

const groupByCargos = (cargos: CargoIssuePrint[]) => {
    return cargos.sort((a, b) => a.type.localeCompare(b.type)).reduce((total: CargoIssuePrint[], currentValue: CargoIssuePrint) => {
        const newTotal = total;
        if (total.length && total[total.length - 1].type === currentValue.type) {
            newTotal[total.length - 1] = {
                type: currentValue.type,
                lengthCargo: Number((total[total.length - 1].lengthCargo + currentValue.lengthCargo).toFixed(2)),
                widthCargo: Number((total[total.length - 1].widthCargo + currentValue.widthCargo).toFixed(2)),
                heightCargo: Number((total[total.length - 1].heightCargo + currentValue.heightCargo).toFixed(2)),
                totalVolume: Number((total[total.length - 1].totalVolume + currentValue.totalVolume).toFixed(3)),
                wightCargo: Number((total[total.length - 1].wightCargo + currentValue.wightCargo).toFixed(2)),
            };
        } else newTotal[total.length] = currentValue;
        return newTotal;
    }, [])
}

const CargoIssuePDF: React.FC<{cargoIssue: CargoIssueResponse}> = ({cargoIssue}) => {
    return (
        <Document>
            <Page size="A5" style={styles.page}>
                <View style={styles.main}>
                    <HeaderPDF id={cargoIssue.id!} />
                    <View style={[styles.row, styles.mt1]}>
                        <View style={styles.col}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>
                                    Дата заявки:
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.body}>
                                    {cargoIssue.createdDate}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.col}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>
                                    Завсклад:
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.body}>
                                    {cargoIssue.createdBy.name}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.row, styles.mt]}>
                        <View style={styles.col}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>
                                    Код клиента:
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.body}>
                                    {cargoIssue.client.code}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.col}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>
                                    Менеджер:
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.body}>
                                    {cargoIssue.approvalBy?.name}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.row, styles.mt]}>
                        <View style={styles.col}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>
                                    Номер машины:
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.body}>
                                    {cargoIssue.numberVehicle}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.row, styles.mt2]}>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={styles.tableDataId}>
                                    <Text style={styles.tableText}>
                                        №
                                    </Text>
                                </View>
                                <View style={styles.tableData}>
                                    <Text style={styles.tableText}>
                                        Вид груза
                                    </Text>
                                </View>
                                <View style={styles.tableData}>
                                    <Text style={styles.tableText}>
                                        Д / Ш / В
                                    </Text>
                                </View>
                                <View style={styles.tableData}>
                                    <Text style={styles.tableText}>
                                        Обьем(м3)
                                    </Text>
                                </View>
                                <View style={styles.tableData}>
                                    <Text style={styles.tableText}>
                                        Вес(кг)
                                    </Text>
                                </View>
                            </View>
                            {
                                groupByCargos(cargoIssue.cargos!).map((cargo, index) => (
                                    <View style={styles.tableRow} key={index}>
                                        <View style={styles.tableDataId}>
                                            <Text style={styles.tableText}>{++index}</Text>
                                        </View>
                                        <View style={styles.tableData}>
                                            <Text style={styles.tableText}>{cargo.type}</Text>
                                        </View>
                                        <View style={styles.tableData}>
                                            <Text style={styles.tableText}>{cargo.lengthCargo} / {cargo.widthCargo} / {cargo.heightCargo}</Text>
                                        </View>
                                        <View style={styles.tableData}>
                                            <Text style={styles.tableText}>{cargo.totalVolume}</Text>
                                        </View>
                                        <View style={styles.tableData}>
                                            <Text style={styles.tableText}>{cargo.wightCargo}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                    <View style={[styles.row, styles.mt1]}>
                        <View style={styles.col}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>
                                    Грузы на сумму:
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.body, styles.fontBold]}>
                                    {cargoIssue.actualAmount} $
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
}

export default CargoIssuePDF
