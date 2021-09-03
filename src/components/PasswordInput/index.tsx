import React, { useState, useCallback } from 'react';
import { Feather } from '@expo/vector-icons'
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';
import { BorderlessButton } from 'react-native-gesture-handler';

import {
  Container,
  IconContainer,
  InputText,  
} from './styles';

interface Props extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  value?: string;
}

export function PasswordInput({ iconName, value, ...rest } : Props){
  const theme = useTheme()
  const [isPasswordVisible, setIsPasswordVisible] = useState(true)

  const [isFilled, setIsFilled] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleInputFocused = () => {
    setIsFocused(true)
  }

  const handleInputBlur = () => {
    setIsFocused(false)
    
    setIsFilled(!!value)    
  }

  const handlePasswordVisibilityChange = useCallback(() => {
    setIsPasswordVisible(state => !state)
  }, [])

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
        {...rest} 
        secureTextEntry={isPasswordVisible} 
        onFocus={handleInputFocused}
        onBlur={handleInputBlur}  
        isFocused={isFocused}
      />

      <BorderlessButton onPress={handlePasswordVisibilityChange}>
        <IconContainer isFocused={isFocused}>
          <Feather 
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={24}
            color={theme.colors.text.detail}
          />
        </IconContainer>
      </BorderlessButton>
    </Container>
  );
}