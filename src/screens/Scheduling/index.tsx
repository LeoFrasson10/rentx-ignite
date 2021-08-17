import React, { useCallback} from 'react';
import { StatusBar } from 'react-native'
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';

import ArrowSvg from '../../assets/arrow.svg'

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  Content,
  Footer
} from './styles';
import { Button } from '../../components/Button';
import { Calendar } from '../../components/Calendar';

export function Scheduling({ navigation: { navigate, goBack } }: any){
  const theme = useTheme()

  const handleConfirmRental = useCallback(() => {
    navigate('SchedulingDetails')
  }, [])

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor='transparent' translucent />
      <Header>
        <BackButton onPress={() => goBack()} color={theme.colors.shape.primary} />

        <Title>
          Escolha uma{`\n`}
          data de início e{`\n`}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue selected={false}></DateValue>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue selected={false}></DateValue>
          </DateInfo>
        </RentalPeriod>

      </Header>

      <Content>
        <Calendar />
      </Content>

      <Footer>
        <Button title="Confirmar" onPress={handleConfirmRental} />
      </Footer>


    </Container>
  );
}