import React, {useState} from 'react';
import { Feather } from '@expo/vector-icons'
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';

import {
  Container,
  IconContainer,
  InputText,
} from './styles';

interface Props extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  value?: string;
}

export function Input({ iconName, value, ...rest } : Props){
  const theme = useTheme()

  const [isFilled, setIsFilled] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleInputFocused = () => {
    setIsFocused(true)
  }

  const handleInputBlur = () => {
    setIsFocused(false)
    
    setIsFilled(!!value)    
  }

  return (
    <Container >
      <IconContainer isFocused={isFocused}>
        <Feather 
          name={iconName}
          size={24}
          color={(isFocused || isFilled) ? theme.colors.main.primary : theme.colors.text.detail}
        />
      </IconContainer>
      <InputText
        onFocus={handleInputFocused}
        onBlur={handleInputBlur} 
        isFocused={isFocused}
        {...rest} 
      />
    </Container>
  );
}