import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Dispatch, CSSProperties } from 'react';
import { MessageProps } from '../Messages';
import styled from 'styled-components';

export interface ClearClassNameProps {
  overlay?: string;
  dialogContent?: string;
  title?: string;
  button?: string;
  buttonContainer?: string;
  confirmButton?: string;
  cancelButton?: string;
  message?: string;
}

export interface ClearStyleProps {
  overlay?: CSSProperties;
  dialogContent?: CSSProperties;
  title?: CSSProperties;
  button?: CSSProperties;
  confirmButton?: CSSProperties;
  cancelButton?: CSSProperties;
  message?: CSSProperties;
  buttonContainer?: CSSProperties;
}

export interface ClearProps {
  setMessages: Dispatch<React.SetStateAction<MessageProps[]>>;
  message?: string;
  className?: ClearClassNameProps;
  style?: ClearStyleProps;
}

export interface ClearProps {
  setMessages: Dispatch<React.SetStateAction<MessageProps[]>>;
  message?: string;
  style?: ClearStyleProps;
}

const Overlay = styled(Dialog.Overlay)`
  background-color: #000;
  opacity: 0.3;
  position: fixed;
  inset: 0;
`;

const Content = styled(Dialog.Content)`
  position: fixed;
  background-color: #333;
  padding: 20px 24px;
  color: #f0f0f0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  width: 80%;
  max-width: 460px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  font-size: 16px;
  border: 1px solid rgba(240, 240, 240, 0.1);
`;

const Title = styled(Dialog.Title)`
  font-weight: 600;
  font-size: 22px;
  border-bottom: 1px solid rgba(240, 240, 240, 0.15);
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const MessageText = styled.p`
  margin: 32px 0;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const buttonStyles = `
  border-radius: 12px; 
  padding: 10px 28px; 
  font-size: 20px; 
  font-weight: 600; 
  transition: background-color 0.3s, transform 0.2s; 
  border: 2px solid transparent; 

  &:hover {
    transform: scale(1.05); 
  }
`;

const CancelButton = styled(Dialog.Close)`
  ${buttonStyles}
  background-color: #555;
  border-color: #777;
  color: #f0f0f0;

  margin-bottom: 16px;
  @media (min-width: 640px) {
    margin-bottom: 0;
  }

  &:hover {
    background-color: #444;
  }
`;

const ConfirmButton = styled(Dialog.Close)`
  ${buttonStyles}
  background-color: #4a90e2;
  border-color: #6a9ae5;
  color: #f0f0f0;

  &:hover {
    background-color: #357ab7;
  }
`;

export default function Clear({
  setMessages = () => {},
  message = 'By clicking yes the chatbot history will be deleted and your conversations will be lost',
  style: s,
}: ClearProps) {
  function clearChat() {
    setMessages([]);
  }

  return (
    <Dialog.Portal>
      <Overlay style={s?.overlay} />

      <Content style={s?.dialogContent}>
        <Title style={s?.title}>Do you really want to clear the chat?</Title>
        <MessageText style={s?.message}>{message}</MessageText>

        <ButtonContainer style={s?.buttonContainer}>
          <CancelButton style={{ ...s?.button, ...s?.cancelButton }}>
            Cancel
          </CancelButton>
          <ConfirmButton
            style={{ ...s?.button, ...s?.confirmButton }}
            onClick={clearChat}
          >
            Yes
          </ConfirmButton>
        </ButtonContainer>
      </Content>
    </Dialog.Portal>
  );
}
