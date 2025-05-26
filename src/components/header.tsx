import React from "react";      
import { View, Text, Image, StyleSheet } from "react-native";

export function Header() {
    return (
        <View style={headerStyle.container}>
        <View style={headerStyle.header}>
            <Image source={require('../assets/favicon.png')} style={headerStyle.headerImage} />
            <Text style={headerStyle.headerText}>EatFlow</Text>
            </View>
        </View>
    );
}

export const headerStyle = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    headerImage: {
        width: 24,
        height: 24,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
        letterSpacing: 1,
        color: '#000',
        marginLeft: 5,
    }
});

export default Header;