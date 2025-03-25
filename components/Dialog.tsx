"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialFocus?: React.RefObject<HTMLElement>;
  showCloseButton?: boolean;
  title?: string;
};

export default function Dialog({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  title,
}: DialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        mx={4}
        bg="white"
        _dark={{ bg: "gray.800" }}
        shadow="xl"
        rounded="lg"
      >
        {title && (
          <ModalHeader
            color="gray.900"
            _dark={{ color: "white" }}
            fontWeight="semibold"
          >
            {title}
          </ModalHeader>
        )}
        {showCloseButton && <ModalCloseButton />}
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
