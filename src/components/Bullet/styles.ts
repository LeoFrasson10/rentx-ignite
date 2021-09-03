import styled from 'styled-components/native';

interface Props{
  active: boolean
}

export const Container = styled.View<Props>`
  width: 6px;
  height: 6px;
  background-color: ${({ theme, active }) => active ? theme.colors.text.title : theme.colors.shape.primary};

  margin-left: 8px;
  border-radius: 3px;
`;