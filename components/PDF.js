import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import MyDocument from './Document';


const PDF = ({ children }) => {

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
                  <MyDocument>
                    {children}
                  </MyDocument>
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
