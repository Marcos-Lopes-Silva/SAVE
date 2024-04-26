'use client'
import React from 'react';
import { Document, PDFViewer, Page, StyleSheet, View, Text } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

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

const PDF = () => {

  const [isLoaded, setLoaded] = useState(false);


  useEffect(() => {

    setLoaded(true);

  }, [0])

  return (
    <>
      {
        isLoaded ?
          (
            
            <Box width={'100%'} maxHeight={'900px'} h={'100vh'} >
              {typeof window !== 'undefined' && (
                <PDFViewer height={'100%'} width={'100%'}>
                  <Document style={styles.document}>
                    <Page size="A4" style={styles.page}>
                      <View style={styles.section}>
                        {/* {components.map((component, index) => <Chart key={index} type={component.type} data={component.data} height={component.height} width={component.width} dataKey={component.dataKey} dataKey2={component.DataKey2} PDF={true}/>)} */}
                        
                      </View>
                    </Page>
                  </Document>
                </PDFViewer>
              )}
            </Box >
            
          )
          : null
      }
    </>
  )
};




export default PDF;
