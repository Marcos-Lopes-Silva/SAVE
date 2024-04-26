import {
  ModalCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

const successToast = {
  title: 'Sucesso',
  description: 'Questionário excluído com sucesso!',
  status: 'success',
  duration: 5000,
}

const errorToast = {
  title: 'Erro',
  description: 'Não foi possível excluir o questionário.',
  status: 'error',
  duration: 5000,
}

export default function DeleteConfirmationModal({ isOpen, onClose, surveyId }) {
  const toast = useToast()
  const router = useRouter()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirme a exclusão</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Você tem certeza que deseja excluir este questionário?</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={async () => {
              await fetch(`/api/surveycreator/${surveyId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              }).then((res) => {
                if (res.status === 204) {
                  onClose()
                  toast(successToast)
                  router.reload()
                } else {
                  toast(errorToast)
                }
              })
            }}
            colorScheme={'red'}
            mr={3}
          >
            Sim
          </Button>
          <Button>Não</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
