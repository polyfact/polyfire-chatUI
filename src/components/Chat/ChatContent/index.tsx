import { HandWaving, PaperPlaneRight, Pencil, Trash } from 'phosphor-react';
import { Dispatch, useEffect, useRef, useState } from 'react';

import {
  MessageClassNameProps,
  MessageProps,
  MessageStyleProps,
  Messages,
} from '../Messages';
import { v4 as uuidv4 } from 'uuid';
import { Chat } from 'polyfire-js';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import styled from 'styled-components';

export interface ChatContentClassNameProps {
  wrapper?: string;
  form?: string;
  inputGroup?: string;
  input?: string;
  sendButton?: string;
  clearButton?: string;
  message?: MessageClassNameProps;
}

export interface ChatContentStyleProps {
  wrapper?: React.CSSProperties;
  form?: React.CSSProperties;
  inputGroup?: React.CSSProperties;
  input?: React.CSSProperties;
  sendButton?: React.CSSProperties;
  clearButton?: React.CSSProperties;
  message?: MessageStyleProps;
}

export interface ChatContentProps {
  chat: Chat;
  messages: MessageProps[];
  setMessages: Dispatch<React.SetStateAction<MessageProps[]>>;
  renderAIFirstMessage?: () => React.ReactNode;
  renderPencilIcon?: () => React.ReactNode;
  renderSendIcon?: () => React.ReactNode;
  renderClearIcon?: () => React.ReactNode;
  placeholderText?: string;
  className?: ChatContentClassNameProps;
  style?: ChatContentStyleProps;
  chatBackgroundColor?: string;
  chatTextColor?: string;
  inputBackgroundColor?: string;
  inputColor?: string;
  placeholderTextColor?: string;
  botMessageColor?: string;
  botMessageBackgroundColor?: string;
  userMessageColor?: string;
  userMessageBackgroundColor?: string;
  botName?: string;
  buttonBackgroundColor?: string;
  buttonBorderColor?: string;
  buttonBorderWidth?: string;
  dotsColor?: string;
  memoryId?: string;
  initialMessage?: string;
}

const AIGreetingContainer = styled.div`
  width: 75%;
  margin: 0 auto;
  padding-top: 3rem;
  text-align: center;
  color: rgba(0, 0, 0, 0.48);
  font-weight: 600;
`;

const AIIcon = styled.div`
  margin: 0 auto;
  margin-bottom: 16px;
`;

const AIText = styled.p``;

const defaultAIFirstMessage = () => (
  <AIGreetingContainer>
    <AIIcon>
      <HandWaving size={40} weight="fill" />
    </AIIcon>
    <AIText>
      "Hello! I am your AI assistant. How can I assist you today?"
    </AIText>
  </AIGreetingContainer>
);

const defaultRenderPencilIcon = () => (
  <Pencil
    size={32}
    weight="fill"
    style={{ marginRight: '10px' }}
    color="white"
  />
);

const defaultRenderSendIcon = () => (
  <PaperPlaneRight size={28} weight="fill" className="m-auto" color="white" />
);

const defaultRenderClearIcon = () => (
  <Trash size={28} weight="fill" className="m-auto" color="white" />
);

const ChatWrapper = styled.div.attrs(props => ({
  style: {
    ...props.style,
  },
  className: props.className,
}))`
  display: grid;
  grid-template-rows: chat;
  background-color: #333;
  border: 1px solid rgba(240, 240, 240, 0.1);
  border-radius: 24px;
  width: 88%;
  height: calc(100% - 10rem);
  max-height: calc(100vh - 10rem);
  margin: 1rem auto 0;
  position: relative;
  padding-bottom: 4.5rem;
`;

const Form = styled.form.attrs(props => ({
  style: {
    ...props.style,
  },
  className: props.className,
}))`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 0 5%;
  position: absolute;
  bottom: 3.5rem;
`;

const InputGroup = styled.div.attrs(props => ({
  style: {
    ...props.style,
  },
  className: props.className,
}))`
  display: flex;
  align-items: center;
  width: 85%;
  border-radius: 16px;
  padding: 6px 12px;
  background-color: #3a3a3a;
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.15);
`;

const TextInput = styled.input.attrs(props => ({
  style: {
    ...props.style,
  },
  className: props.className,
}))<{ placeholderTextColor: string }>`
  width: 100%;
  outline: none;
  background-color: transparent;
  border: none;
  font-size: 17px;
  padding: 6px 0;

  ::placeholder {
    color: ${props => props.placeholderTextColor} !important;
    opacity: 1;
  }

  /* For Internet Explorer 10-11 */
  :-ms-input-placeholder {
    color: ${props => props.placeholderTextColor} !important;
  }

  /* For Internet Explorer 9 */
  ::-ms-input-placeholder {
    color: ${props => props.placeholderTextColor} !important;
  }
`;

const Button = styled.div.attrs(props => ({
  style: {
    ...props.style,
  },
  className: props.className,
  ...props,
}))<{
  buttonBorderColor: string;
  buttonBorderWidth: string;
  bgColor: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  width: 56px;
  height: 56px;
  border-width: ${props => props.buttonBorderWidth};
  border-color: ${props => props.buttonBorderColor};
  border-style: solid;
  transition: transform 0.2s, background-color 300ms ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
  background-color: ${props => props.bgColor};

  &:hover {
    opacity: 0.8;
  }
`;

function getContrastColor(bgColor: string): string {
  if (!bgColor) return '#FFFFFF';
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function ChatContent({
  chat = new Chat(),
  messages = [],
  setMessages = () => {},
  renderAIFirstMessage = defaultAIFirstMessage,
  renderPencilIcon = defaultRenderPencilIcon,
  renderSendIcon = defaultRenderSendIcon,
  renderClearIcon = defaultRenderClearIcon,
  placeholderText = 'Write your question here..',
  className: c,
  style: s = {},
  chatBackgroundColor = '#CCCCCC55',
  chatTextColor = '#FFFFFF',
  inputBackgroundColor = '#555',
  inputColor = '#DDDDDD',
  placeholderTextColor = '#a799a8',
  buttonBackgroundColor = '#000000',
  buttonBorderColor = '#666666',
  buttonBorderWidth = '0px',
  botMessageColor,
  botMessageBackgroundColor,
  userMessageColor,
  userMessageBackgroundColor,
  botName = 'AI-Chatbot',
  dotsColor = '#FFFFFF',
  memoryId,
  initialMessage,
}: ChatContentProps) {
  const [inputText, setInputText] = useState('');
  const [disableTextInput, setDisableTextInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      addMessage('userMessage', initialMessage, true);
      setLoading(true);
      setDisableTextInput(true);

      try {
        const answer = chat.sendMessage(
          initialMessage,
          memoryId?.length ? { memoryId } : {}
        );
        // @ts-ignore
        answer.on('data', handleData);
        // @ts-ignore
        answer.on('end', () => setLoading(false));

        setDisableTextInput(false);
        setLoading(false);
      } catch (error) {
        console.log('error', error);
        setDisableTextInput(false);
        setLoading(false);
      } finally {
      }
    }
  }, [initialMessage]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (inputText.length === 0) return;

    addMessage('userMessage', inputText.trim());
    setLoading(true);
    setInputText('');

    try {
      console.log('memoryId', memoryId);
      const answer = chat.sendMessage(
        inputText.trim(),
        memoryId?.length ? { memoryId } : {}
      );
      // @ts-ignore
      answer.on('data', handleData);

      // @ts-ignore
      answer.on('error', handleData);
      // @ts-ignore
      answer.on('end', () => setLoading(false));
    } catch (error) {
      setLoading(false);
      setDisableTextInput(false);
      console.log('error', error);
    }
  }

  function addMessage(
    type: string,
    message: string,
    isHidden: boolean = false
  ) {
    const newMessage: MessageProps = {
      id: uuidv4(),
      isUser: type === 'userMessage',
      message: message ?? inputText,
      hidden: isHidden,
      createdAt: {
        hour: new Date().getHours(),
        minutes: new Date().getMinutes(),
      },
    };
    setMessages([...messages, newMessage]);
  }

  function handleData(data: { code: string; message: string } | string) {
    const currentMessages = [...messagesRef.current];
    const lastMsg = currentMessages[currentMessages.length - 1];

    const message =
      typeof data === 'object' && data !== null && 'code' in data
        ? data.message
        : data.toString();

    if (lastMsg?.isUser) {
      currentMessages.push({
        id: uuidv4(),
        isUser: false,
        message: message,
        createdAt: {
          hour: new Date().getHours(),
          minutes: new Date().getMinutes(),
        },
      });
    } else if (!lastMsg?.isUser) {
      lastMsg.message += message;
    }

    setMessages(currentMessages);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <ChatWrapper
      style={{
        backgroundColor: chatBackgroundColor,
        color: chatTextColor,
        ...s?.wrapper,
      }}
      className={c?.wrapper}
    >
      {messages.length === 0 && renderAIFirstMessage()}
      {messages.length > 0 && (
        <Messages
          messages={messages}
          loading={loading}
          className={c?.message}
          style={s?.message}
          botMessageColor={
            botMessageColor ||
            getContrastColor(botMessageBackgroundColor as string)
          }
          botMessageBackgroundColor={botMessageBackgroundColor}
          userMessageColor={
            userMessageColor ||
            getContrastColor(userMessageBackgroundColor as string)
          }
          userMessageBackgroundColor={userMessageBackgroundColor}
          botName={botName}
          dotsColor={dotsColor}
        />
      )}

      <Form style={s.form}>
        <InputGroup
          style={{ backgroundColor: inputBackgroundColor, ...s?.inputGroup }}
          className={c?.inputGroup}
        >
          {renderPencilIcon()}
          <TextInput
            type="text"
            placeholder={placeholderText}
            onChange={event => setInputText && setInputText(event.target.value)}
            value={inputText}
            disabled={disableTextInput}
            style={{ color: inputColor, ...s.input }}
            className={c?.input}
            placeholderTextColor={placeholderTextColor}
            onKeyPress={handleKeyPress}
          />
        </InputGroup>

        <Dialog.Trigger
          style={{ border: 'none', backgroundColor: chatBackgroundColor }}
        >
          <Button
            style={{ ...s?.clearButton }}
            className={c?.clearButton}
            buttonBorderColor={buttonBorderColor}
            buttonBorderWidth={buttonBorderWidth}
            bgColor={buttonBackgroundColor}
          >
            {renderClearIcon()}
          </Button>
        </Dialog.Trigger>

        <Button
          style={{ ...s?.sendButton }}
          className={c?.sendButton}
          onClick={handleSubmit}
          buttonBorderColor={buttonBorderColor}
          buttonBorderWidth={buttonBorderWidth}
          bgColor={buttonBackgroundColor}
        >
          {renderSendIcon()}
        </Button>
      </Form>
    </ChatWrapper>
  );
}
