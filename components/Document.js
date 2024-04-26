import React from 'react';
import { Document, Page, View, StyleSheet, Text } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';

// Create styles
const styles = StyleSheet.create({
    document: {
        width: '100%',
        height: '100%'
    },
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

// Create Document Component
export const MyDocument = ({ children }) => {

    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {

        setLoaded(true);

    }, [0])
    return (
        <>
            {isLoaded &&
                <Document style={styles.document}>
                    <Page size="A4" style={styles.page}>
                        <View style={styles.section}>
                            <Text>Olá mundo</Text>
                           

                        </View>
                    </Page>
                </Document>
            }
        </>


    )
};




export default MyDocument;