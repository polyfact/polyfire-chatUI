import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import { useState } from 'react';

import Clear, { ClearClassNameProps, ClearStyleProps } from './Clear';
import {
  ChatContent,
  ChatContentClassNameProps,
  ChatContentProps,
  ChatContentStyleProps,
} from './ChatContent';
import { MessageProps } from './Messages';
import styled from 'styled-components';

type ChatInterfaceProps = {
  height?: string;
  width?: string;
};

export type ChatUIProps = Omit<
  ChatContentProps,
  'className' | 'style' | 'messages' | 'setMessages'
> & {
  classNameChatContent?: ChatContentClassNameProps;
  styleChatContent?: ChatContentStyleProps;
  classNameClearModal?: ClearClassNameProps;
  styleClearModal?: ClearStyleProps;
  TitleClearModal?: string;
} & ChatInterfaceProps;

const ChatInterface = styled.div<ChatInterfaceProps>`
  width: ${(props: ChatInterfaceProps) => props.width || '70%'};
  height: ${(props: ChatInterfaceProps) => props.height || '100vh'};
  min-height: 300px;
  min-width: 300px;
`;

const ChatUI: React.FC<ChatUIProps> = ({
  classNameChatContent,
  styleChatContent,
  classNameClearModal,
  styleClearModal,
  height,
  width,
  ...props
}) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  return (
    <Dialog.Root>
      <Clear
        setMessages={setMessages}
        style={styleClearModal}
        className={classNameClearModal}
      />
      <ChatInterface height={height} width={width}>
        <ChatContent
          setMessages={setMessages}
          messages={messages}
          style={styleChatContent}
          className={classNameChatContent}
          {...props}
        />
      </ChatInterface>
    </Dialog.Root>
  );
};

export default ChatUI;
