import React from 'react';
import styled from 'styled-components';
import { useEffect } from 'react';
import ThreeDotLoader from './ThreeDotLoader';

const Chat = styled.div.attrs(props => ({
  style: {
    ...props.style,
  },
  className: props.className,
}))`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
  height: calc(100% - 80px);
  overflow-y: scroll;
  padding: 1rem;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const MessageBubble = styled.div.attrs(props => ({
  style: {
    ...props.style,
  },
  className: props.className,
}))<{
  isUser: boolean;
  color: string;
  bgColor: string;
}>`
  padding: 1rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: ${props =>
    props.isUser ? '15px 0px 15px 15px' : '0px 15px 15px 15px'};
  background-color: ${props => props.bgColor};
  color: ${props => props.color};
  display: flex;
  flex-direction: column;
  max-width: 70%;
  min-width: 30%;
  margin: 0.5rem 0;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
`;

const MessageText = styled.p.attrs(props => ({
  style: {
    ...props.style,
  },
  className: props.className,
}))`
  margin: 0;
`;

const MessageFooter = styled.span.attrs(props => ({
  style: {
    ...props.style,
  },
  className: props.className,
}))`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-weight: 100;
  font-size: 0.75rem;
`;

const Name = styled.span.attrs(props => ({
  style: {
    ...props.style,
  },
  className: props.className,
}))`
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border: 2px solid #add666;
  border-radius: 10px;
  background-color: #e8f5e9;
  color: #4caf50;
  margin-right: 0.5rem;
`;

export interface MessageProps {
  id: string;
  isUser: boolean;
  message: string;
  hidden?: boolean;
  createdAt: {
    hour: number;
    minutes: number;
  };
}

export interface MessageClassNameProps {
  message?: string;
  userMessage?: string;
  botMessage?: string;
}

export interface MessageStyleProps {
  message?: React.CSSProperties;
  userMessage?: React.CSSProperties;
  botMessage?: React.CSSProperties;
}

interface TMessage {
  messages: MessageProps[];
  loading: boolean;
  className?: MessageClassNameProps;
  style?: MessageStyleProps;
  botMessageColor?: string;
  botMessageBackgroundColor?: string;
  userMessageColor?: string;
  userMessageBackgroundColor?: string;
  botName?: string;
  dotsColor?: string;
}

export function Messages({
  messages,
  loading,
  botName = 'AI-Chatbot',
  botMessageBackgroundColor = '#ADD666',
  botMessageColor = '#333333',
  userMessageColor = '#FFFFFF',
  userMessageBackgroundColor = '#B3B3B3',
  dotsColor = '#FFFFFF',
  style = {},
  className,
}: TMessage) {
  useEffect(() => {
    const chat = document.querySelector('.chat');
    if (chat) chat.scrollTop = chat.scrollHeight;
  }, [messages]);

  return (
    <Chat className="chat">
      {messages.map(message => (
        <MessageBubble
          isUser={message.isUser}
          key={message.id}
          bgColor={
            message.isUser
              ? userMessageBackgroundColor
              : botMessageBackgroundColor
          }
          color={message.isUser ? userMessageColor : botMessageColor}
          style={message.isUser ? style?.userMessage : style?.botMessage}
          className={
            message.isUser ? className?.userMessage : className?.botMessage
          }
        >
          <MessageText style={style?.message} className={className?.message}>
            {message.message}
          </MessageText>
          <MessageFooter style={style?.message}>
            <Name>{message.isUser ? 'Me' : botName}</Name>
            {`${message.createdAt.hour}:${
              message.createdAt.minutes < 10
                ? `0${message.createdAt.minutes}`
                : message.createdAt.minutes
            }`}
          </MessageFooter>
        </MessageBubble>
      ))}
      {loading && messages?.[messages?.length - 1]?.isUser && (
        <MessageBubble
          isUser={false}
          bgColor={botMessageBackgroundColor}
          color={botMessageColor}
          style={{}}
        >
          <MessageText style={style?.message} className={className?.message}>
            <ThreeDotLoader color={dotsColor} style={{ margin: '10px' }} />
          </MessageText>
          <MessageFooter style={style?.message}>
            <Name>{botName}</Name>
          </MessageFooter>
        </MessageBubble>
      )}
    </Chat>
  );
}
