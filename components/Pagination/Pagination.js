import { Box, List, ListItem } from "@chakra-ui/react";
import { usePagination, DOTS } from "./usePagination";

const Pagination = props => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize
    } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    // Se houver menos que 2 vezes no intervalo de paginação, não renderizamos o componente
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];
    return (
        <List
            display={'flex'}
            listStyleType={'none'}
            alignSelf={'center'}
            h={'auto'}
            marginBottom={'20px'}
        >
            {/* Seta de navegação da esquerda */}
            <ListItem
                padding={'0px 12px'}
                height={'32px'}
                textAlign={'center'}
                margin={'auto 4px'}
                color={'rgba(0, 0, 0, 0.87)'}
                display={'flex'}
                boxSizing="border-box"
                alignItems="center"
                letterSpacing={'0.01071em'}
                borderRadius={'16px'}
                lineHeight={1.43}
                fontSize={'13px'}
                min-width={'32px'}
                pointerEvents={currentPage === 1 ? 'none' : 'auto'}
                onClick={onPrevious}
            >
                <Box
                    _before={{
                        position:'relative',
                        content:'""',
                        display:'inline-block',
                        width:'0.4em',
                        height:'0.4em',
                        borderRight:'0.12em solid rgba(0, 0, 0, 0.87)',
                        borderTop:'0.12em solid rgba(0, 0, 0, 0.87)',
                    }}
                    transform='rotate(-135deg) translate(-50%)' />
            </ListItem>
            {paginationRange.map(pageNumber => {
               
                // Se o pageItem for um PONTO (DOT), renderize o caractere unicode DOTS
                if (pageNumber === DOTS) {
                    return <ListItem
                        padding={'0px 12px'}
                        height={'32px'}
                        textAlign={'center'}
                        margin={'auto 4px'}
                        color={'rgba(0, 0, 0, 0.87)'}
                        display={'flex'}
                        boxSizing="border-box"
                        alignItems="center"
                        letterSpacing={'0.01071em'} 
                        borderRadius={'16px'}
                        lineHeight={1.43}
                        fontSize={'13px'}
                        min-width={'32px'}
                        _hover={{
                            backgroundColor: 'transparent',
                            cursor: 'default'
                        }}
                    >&#8230;</ListItem>;
                }

                // Renderize a amostra de página
                return (
                    <ListItem
                        padding={'0px 12px'}
                        height={'32px'}
                        textAlign={'center'}
                        margin={'auto 4px'}
                        color={'rgba(0, 0, 0, 0.87)'}
                        display={'flex'}
                        boxSizing="border-box"
                        alignItems="center"
                        letterSpacing={'0.01071em'}
                        borderRadius={'16px'}
                        lineHeight={1.43}
                        fontSize={'13px'}
                        min-width={'32px'}
                        backgroundColor={pageNumber === currentPage ? 'rgba(0, 0, 0, 0.08)' : null}
                        _hover={{
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            cursor: 'pointer'
                        }}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </ListItem>
                );
            })}
            {/*  Seta de navegação da direita */}
            <ListItem
                padding={'0px 12px'}
                height={'32px'}
                textAlign={'center'}
                margin={'auto 4px'}
                color={'rgba(0, 0, 0, 0.87)'}
                display={'flex'}
                boxSizing="border-box"
                alignItems="center"
                letterSpacing={'0.01071em'}
                borderRadius={'16px'}
                lineHeight={1.43}
                fontSize={'13px'}
                min-width={'32px'}
                pointerEvents={currentPage === lastPage ? 'none' : 'auto'}
                onClick={onNext}
            >
                <Box
                    _before={{
                        position:'relative',
                        content:'""',
                        display:'inline-block',
                        width:'0.4em',
                        height:'0.4em',
                        borderRight:'0.12em solid rgba(0, 0, 0, 0.87)',
                        borderTop:'0.12em solid rgba(0, 0, 0, 0.87)',
                    }}
                    transform='rotate(45deg)'
                />
            </ListItem>
        </List>
    );
};

export default Pagination;