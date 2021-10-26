import React from 'react';
import {Font, Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import {CargoIssueResponse} from "../../../../model/Cargo";

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

const CargoIssuePDF: React.FC<{cargoIssue: CargoIssueResponse}> = ({cargoIssue}) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>

            </Page>
        </Document>
    )
}

export default CargoIssuePDF
