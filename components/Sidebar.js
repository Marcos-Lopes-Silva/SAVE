import { Box, CloseButton, Drawer, DrawerContent, Flex, Icon, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { QuestionOutlineIcon } from "@chakra-ui/icons"


const Sidebar = ({ linkItems }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box
            marginTop={'45px'}
            pos={'fixed'}
            width={'360px'}
            height={'94vh'}
            borderRadius={'0px 6px 6px 6px'}
            background={'var(--gray-400, #2C2C2C)'}
        >
            <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} linkItems={linkItems} />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} linkItems={linkItems} />
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

const SidebarContent = ({ onClose, linkItems, ...rest }) => {


    return (
        <Box
            
            background={'var(--gray-400, #2C2C2C)'}
            width={'360px'}
            borderRadius={'0px 6px 6px 6px'}
            color={'white'}
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between" pos={'static'}>
                <Text color={'var(--white-white, #FFF)'}
                    fontSize={'24px'}
                    fontStyle={'normal'}
                    fontWeight={'600'}
                    lineHeight={'120%'}>
                    Menu
                </Text>
                <Box><Text _hover={{color:"gray", cursor:"pointer"}} fontWeight={'bold'} onClick={onClose} color={'white'}>{'<<'}</Text></Box>
            </Flex>
            <Box
                width={'360px'}
                pos={'absolute'}
                height={'100%'}
                overflowY={'scroll'}
            >
                {linkItems.map((link) => (
                    <NavItem key={link.name} icon={link.icon}>
                        <Text
                            color={'#D9D9D9'}
                            fontSize={'16px'}
                            fontStyle={'normal'}
                            fontWeight={'600'}
                            lineHeight={'120%'} /* 19.2px */
                        >
                            {link.name}
                        </Text>

                    </NavItem>
                ))}
                <Box
                    display= {'flex'}
                    width= {'276px'}
                    height= {'52.5px'}
                    padding= {'16px'}
                    align-items= {'center'}
                    gap= {'16px'}
                    flex-shrink= {'0'}
                >
                    <QuestionOutlineIcon width={'20.5px'} flexShrink={0} height={'20.5px'}/>
                    <Text
                        color= {'var(--gray-100, #9E9E9E)'}

                        /* Body */
                        font-family= {'Inter'}
                        font-size= {'6px'}
                        font-style= {'normal'}
                        font-weight= {'600'}
                        line-height= {'120%'} /* 19.2px */
                    >
                        Ajuda
                    </Text>
                </Box>
                <Box>

                </Box>
            </Box>

        </Box>
    )
}

const NavItem = ({ icon, children, ...rest }) => {
    return (
        <Box
            as="a"
            href="#"
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Text marginRight={'10px'}
                        color={'#D9D9D9'}
                        /* Body */
                        fontSize={'16px'}
                        fontStyle={'normal'}
                        fontWeight={'600'}
                        lineHeight={'120%'} /* 19.2px */
                    >{icon}</Text>
                )}
                {children}
            </Flex>
        </Box >
    )
}



export default Sidebar;