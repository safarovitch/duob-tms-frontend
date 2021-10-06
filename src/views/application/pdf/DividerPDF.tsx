import React from "react";
import {View, StyleSheet} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  root: {
      borderBottomColor: 'black',
      borderBottomStyle: 'dotted',
      borderBottomWidth: 1
  }
})

const DividerPDF: React.FC = () => <View style={styles.root} />

export default DividerPDF
