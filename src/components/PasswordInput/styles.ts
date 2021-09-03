import { RFValue } from 'react-native-responsive-fontsize';
import { TextInput } from 'react-native'
import styled, {css} from 'styled-components/native';

interface Props {
  isFocused: boolean;
}

export const Container = styled.View`
  flex-direction: row;
  margin-bottom: 8px;

  
`;

export const IconContainer = styled.View<Props>`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  justify-content: center;
  align-items: center;

  height: 56px;
  width: 55px;
  margin-right: 2px;

  ${({ theme, isFocused }) => isFocused && css`
    border-bottom-width: 2px;
    border-bottom-color: ${theme.colors.main.primary};
  `}
`;

export const InputText = styled(TextInput)<Props>`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  flex: 1;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fonts.primary_400};
  font-size: ${RFValue(15)}px;
  padding: 0 23px;

  ${({ theme, isFocused }) => isFocused && css`
    border-bottom-width: 2px;
    border-bottom-color: ${theme.colors.main.primary};
  `}
`
