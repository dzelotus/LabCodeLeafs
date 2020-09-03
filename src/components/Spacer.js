import React from "react";
import { View, StyleSheet } from "react-native";

const Spacer = ({ children }) => {
    return <View style={styles.spacer}>{children}</View>;
};

const styles = StyleSheet.create({
    spacer: {
        marginHorizontal: 10,
        marginTop: 10,
    },
});

export default Spacer;
