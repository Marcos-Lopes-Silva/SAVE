import {
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const successToast = {
  title: 'Identidade confirmada com sucesso!',
  description: 'Agora você pode responder ao questionário.',
  status: 'success',
  duration: 5000,
}

const failureToast = {
  title: 'Não foi possível confirmar sua identidade.',
  description: 'Por favor, tente novamente.',
  status: 'error',
  duration: 5000,
}

export default function IdentificationModal({ isOpen, onClose }) {
  const toast = useToast()
  const router = useRouter()
  const { data: session } = useSession()
  const initialRef = useRef(null)
  const finalRef = useRef(null)
  const [state, setState] = useState({
    name: '',
    birthDate: null,
  })

  const handleSubmit = async () => {
    const { name, birthDate } = state
    const getId = await fetch('/api/id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, birthDate }),
    })
    const { id } = await getId.json()

    if (id) {
      await fetch('/api/elligibleuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers_from_2020_id: id, userId: session.user._id }),
      }).then((res) => {
        if (res.status === 201) {
          toast(successToast)
          onClose()
          router.reload()
        } else {
          toast(failureToast)
        }
      })
    } else {
      toast(failureToast)
    }
  }

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirme sua identidade</ModalHeader>
        <ModalBody pb={6}>
          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <Input
              ref={initialRef}
              type='text'
              placeholder='Nome'
              onChange={handleChange}
              name={'name'}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Data de nascimento</FormLabel>
            <Input type='date' onChange={handleChange} name={'birthDate'} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={'teal'} mr={3} onClick={handleSubmit}>
            Confirmar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
