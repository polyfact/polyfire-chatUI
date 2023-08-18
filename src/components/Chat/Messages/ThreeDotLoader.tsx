import React from 'react';
import { CSSProperties } from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const LoaderContainer = styled.div.attrs(props => ({
  style: {
    ...props.style,
  },
  className: props.className,
}))`
  display: flex;
  alignSelf: "flex-start",
  display: "flex",
`;

const Dot = styled.div<{ color: string }>`
  background-color: ${props => props.color};
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 5px;
  animation: ${bounce} 1s infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

function ThreeDotLoader({
  color,
  style,
  className,
}: {
  color: string;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <LoaderContainer style={style} className={className}>
      <Dot color={color} />
      <Dot color={color} />
      <Dot color={color} />
    </LoaderContainer>
  );
}

export default ThreeDotLoader;
