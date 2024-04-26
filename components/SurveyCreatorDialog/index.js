import { PiUsersThreeFill } from "react-icons/pi";
import styles from './Dialog.module.css';
import { MdOutlineMailOutline, MdAddLink } from "react-icons/md";
import { toast } from "react-toastify";
import { 
    Box,
    AlertDialog,
    AlertDialogBody,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    Text,
    List,
    ListItem,
    Checkbox
    } from "@chakra-ui/react";
import { Form } from "../Form";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import Buscador from "../Buscador";
import { set } from "mongoose";

const createEmailSchema = z.object({
    email: z.string().email(),
    subject: z.string().min(5).max(50),
    message: z.string().min(5).max(500),
});

export default function SurveyCreatorDialog({ isOpen, cancelRef, onClose, surveyId, groups }) {

  const linkPrefix = process.env.NEXTSURVEY_PREFIXLINK;

  const [ sendType, setSendType ] = useState('e-mail');
  const [ busca, setBusca ] = useState('');
  const [ checkedGroups, setCheckedGroups ] = useState([]);
  const [ isGroupSelected, setIsGroupSelected ] = useState(false);


  const createEmailForm = useForm({
      resolver: zodResolver(createEmailSchema),
    });

  const {
  handleSubmit,
  formState: { isSubmitting },
  } = createEmailForm;

  const [sendTypes, setSendTypes] = useState([
    {
      title: 'e-mail',
      body: (
        <Box display={'flex'} pr={'30px'} mt={'20px'} flexDir={'column'} gap={'10px'}>
            <Box display={"flex"} flexDir={"column"} gap={2}>
                <Form.Label className={styles.label}>Para:</Form.Label>
                <Form.Input className={styles.input} name="email" placeholder={'egress@gmail.com'} />
                <Form.ErrorMessage field={'email'} />
            </Box>
            <Box display={"flex"} flexDir={"column"} gap={2}>
                <Form.Label className={styles.label}>Assunto:</Form.Label>
                <Form.Input className={styles.input} name="subject" placeholder={'Questionário egressos Unipampa'} />
                <Form.ErrorMessage field={'subject'} />
            </Box>
            <Box display={"flex"} flexDir={"column"} gap={2}>
                <Form.Label className={styles.label}>Mensagem:</Form.Label>
                <Form.Input className={styles.input} name="message" placeholder={'Convite para preencher o questionário'} />
                <Form.ErrorMessage field={'message'} />
            </Box>
        </Box>
        
      )
    },
    {
      title: 'link',
      body: (
        <Box display={'flex'} flexDir={'column'} gap={2} mt={6}>
          <Form.Label className={styles.label}>Link:</Form.Label>
            <Form.Input placeholder={''} className={styles.input} name={'link'} value={`${linkPrefix}${surveyId}`}/>
        </Box>
      )
    }
  ]);
  
  function changeSendType(e, type) {
    e.preventDefault();

    switch(type) {
      case 'e-mail': 
        setSendType('e-mail')
        break;
      case 'link': 
        setSendType('link')
        break;
      case 'users': 
        setSendType('users')
        break;
      default: break;
    }
  }
  
  const sendEmail = async (email, subject, message) => {
    const response = await fetch('/api/utils/mailer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: subject,
        text: message,
      }),
    });
    response.ok ? toast.success('E-mail enviado com sucesso!') : toast.error('Erro ao enviar e-mail.');
  };
  
  const saveSurvey = async () => {
    const response = await fetch('/api/surveycreator/1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        survey: survey,
      }),
    
    });
    response.ok ? toast.success('Questionário salvo com sucesso!') : toast.error('Erro ao salvar questionário.');
  }
  
  function sendSurvey(data, e) {
    e.preventDefault();
    console.log(data);
    
    switch(sendType) {
      case 'e-mail': 
        sendEmail(data.email, data.subject, data.message);
        break;
      case 'link': 
        setSendType('link')
        break;
      case 'users': 
        setSendType('users')
        break;
      default: break;
    }

    // saveSurvey();
    onClose();
  }

  const changeView = (event) => {
    event.preventDefault();
    setIsGroupSelected(true);
  }

  const listaFiltrada = useMemo(() => {
    return groups.filter((item) => testaBusca(item.title));
  })

    function testaBusca(title) {
      if (busca === '') return true;
      const regex = new RegExp(busca, 'i');
      return regex.test(title);
  }


  useEffect(() => {}, [listaFiltrada]);  

  return (
    <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent minH={'250px'} minW={'450px'} mt={'56'}>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Enviar questionário
            </AlertDialogHeader>

            <AlertDialogBody display={'flex'} flexDir={'column'} gap={15}>
              <Box display={'flex'} flexDir={'column'}>
                <Text fontWeight={'semibold'} mb={5}>Selecione um grupo</Text>
                <Text fontWeight={'bold'} >Grupos: </Text>
                <Box display={'flex'} minH={'120px'} flexDir={'column'} borderRadius={'2xl'} boxShadow={'lg'} p={3} >
                  <Buscador iconSize={20} width={'80%'} height={'30px'} busca={busca} setBusca={setBusca} content={'Procure por questionários'}/>
                  
                  <List spacing={3} minH={'100px'}>
                    <ListItem>
                      {listaFiltrada && listaFiltrada.map((group) => (
                        <Checkbox 
                          isChecked={checkedGroups[0]}
                          onChange={(e) => setCheckedGroups([...checkedGroups, e.target.checked])}
                          value={group._id}>
                            {group.name}
                          </Checkbox>
                      ))}
                    </ListItem>
                  </List>

                  <Box display={'flex'} flexDir={'row'} w={'100%'} gap={110}>

                  <Button w={'auto'} padding={'2'} height={'6'} fontWeight={'semibold'} mt={'5'} border={'1px'} bg={'white'} borderRadius={'3xl'} >
                    Gerenciar participantes
                  </Button>
                  <Button onClick={(event) => changeView(event)} w={'auto'} _hover={{color: 'lightgray'}} padding={'2'} pr={'8'} pl={'8'} height={'6'} fontWeight={'semibold'} mt={'5'} border={'1px'} bg={'blackAlpha.900'} color={'white'} borderRadius={'3xl'} >
                    Ok
                  </Button>

                  </Box>
                </Box>
              </Box>

              {isGroupSelected && (

                <>
                  <Box display={'flex'} gap={5}>
                    <Text>Enviar via</Text> 
                    <MdOutlineMailOutline size={20} className={sendType === 'e-mail' ? styles.setedIcon : null} onClick={(e) => changeSendType(e, 'e-mail')}/>
                    <MdAddLink size={20} className={sendType === 'link' ? styles.setedIcon : null} onClick={(e) => changeSendType(e, 'link')}/>
                  </Box>
                  { sendTypes.map((type) => {
                    if (type.title === sendType)
                      return (
                        <FormProvider key={type.title} {...createEmailForm}>
                          <form onSubmit={handleSubmit(sendSurvey)}>
                            <Text>Enviar por {type.title}</Text>
                            {type.body}

                            <Box display={"flex"} gap={2} justifyContent={'flex-end'} mt={10}>
                            <Button ref={cancelRef} onClick={onClose}>
                              Cancelar
                            </Button>
                            <Button colorScheme='red' type="submit" ml={3}>
                              Confirmar
                            </Button>
                            </Box>
                          </form>
                        </FormProvider>
                      )
                  })}
                </>

              )}
            
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
  )
}

