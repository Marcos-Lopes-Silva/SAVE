import { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { Box, Button, useColorMode } from '@chakra-ui/react';


export default function Filtros({
    filtros,
    filtro,
    setFiltro
}) {
    const [aberto, setAberto] = useState(false);
    const {colorMode} = useColorMode();
    const nomeFiltro = filtro && filtros.find(opcao => opcao === filtro);
    return (
        <Button
            marginLeft={'5px'}
            overflowX={'hidden'}
            marginRight={'10px'}
            display={'flex'}
            alignItems={'center'}
            backgroundColor={'none'}
            border={'none'}
            borderTopLeftRadius={'4px'}
            borderTopRightRadius={'4px'}
            fontSize={'1rem'}
            height={'50px'}
            justifyContent={'space-between'}
            minWidth={'240px'}
            padding={'0 40px'}
            position={'relative'}
            onClick={() => setAberto(!aberto)}
            onBlur={() => setAberto(false)}
        >
            <span>{nomeFiltro || 'Selecione um'}</span>
            {aberto ? <MdKeyboardArrowUp size={20} /> : <MdKeyboardArrowDown size={20} />}
            <Box
                display={aberto ? 'flex' : 'none'}
                position={'absolute'}
                left={0}
                flexDirection={'column'}
                top={'100%'}
                width={'100%'}
            >
                {filtros.map((opcao, index) => (
                    <Box
                        overflow={'hidden'}
                        alignItems={'center'}
                        marginTop={'-2px'}
                        backgroundColor={colorMode === 'light' ? '#EDF2F7' : 'rgba(255, 255, 255, 0.08)'}
                        borderTop={'1px none'}
                        boxSizing='border-box'
                        color={colorMode === 'light' ? 'dark' : 'light'}
                        display={'flex'}
                        height={'40px'}
                        justifyContent={'center'}
                        width={'inherit'}
                        _hover={{cursor:'pointer', color:'gray.500'}}
                        key={index}
                        onClick={() => setFiltro(opcao)}
                    >
                        {opcao}
                    </Box>
                ))}
            </Box>
        </Button>
    );
}