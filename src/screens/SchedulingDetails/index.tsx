import React, { useCallback} from 'react';
import { Feather } from '@expo/vector-icons';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import speedSvg from '../../assets/speed.svg'
import accelerationSvg from '../../assets/acceleration.svg'
import forceSvg from '../../assets/force.svg'
import gasolineSvg from '../../assets/gasoline.svg'
import exchangeSvg from '../../assets/exchange.svg'
import peopleSvg from '../../assets/people.svg'

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brend,
  Name,
  Rent,
  Period,
  Price,
  Acessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
} from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

export function SchedulingDetails({ navigation: { navigate, goBack } }: any){
  const theme = useTheme()

  const handleConfirm = useCallback(() => {
    navigate('SchedulingComplete')
  }, [])

  return (
    <Container>
      <Header>
        <BackButton onPress={ () => goBack()} />
      </Header>
      <CarImages>
        <ImageSlider imagesUrl={['https://freepngimg.com/thumb/audi/35227-5-audi-rs5-red.png']} />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brend>Audi</Brend>
            <Name>Audi Rs 5 coupé</Name>
          </Description>

          <Rent>
            <Period>Ao dia</Period>
            <Price>R$ 580</Price>
          </Rent>
        </Details>
        <Acessories>
          <Accessory name="380 km/h" icon={speedSvg} />
          <Accessory name="3.2s" icon={accelerationSvg} />
          <Accessory name="800hp" icon={forceSvg} />
          <Accessory name="Gasolina" icon={gasolineSvg} />
          <Accessory name="Auto" icon={exchangeSvg} />
          <Accessory name="2 pessoas" icon={peopleSvg} />

        </Acessories>

        <RentalPeriod>
          <CalendarIcon>
            <Feather name="calendar" size={RFValue(24)} color={theme.colors.shape.primary} />
          </CalendarIcon>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>16/08/2021</DateValue>
          </DateInfo>

          <Feather name="chevron-right" size={RFValue(12)} color={theme.colors.text.primary} />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>18/08/2021</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>R$ 580 x3 diárias</RentalPriceQuota>
            <RentalPriceTotal>R$ 2.900</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>

      </Content>
      <Footer>
        <Button title="Alugar agorar" onPress={handleConfirm} color={theme.colors.success.primary} />
      </Footer>
    </Container>
  );
}