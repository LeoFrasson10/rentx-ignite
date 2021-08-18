import React, { useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon'; 

import { CarDTO } from '../../dtos/CarDTO';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  About,
  Accessories,
  Footer
} from './styles';


interface Params {
  car: CarDTO
}

export function CarDetails({ navigation: { navigate, goBack } }: any){
  const route = useRoute()
  const { car } = route.params as Params

  const handleConfirmRental = useCallback(() => {
    navigate('Scheduling', {
      car
    })
  }, [])

  return (
    <Container>
      <Header>
        <BackButton onPress={() => goBack()} />
      </Header>
      <CarImages>
        <ImageSlider imagesUrl={car.photos} />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.rent.period}</Period>
            <Price>{`R$ ${car.rent.price}`}</Price>
          </Rent>
        </Details>
        <Accessories>
          {car.accessories.map((accessory) => (
            <Accessory key={accessory.type} name={accessory.name} icon={getAccessoryIcon(accessory.type)} />
          ))}          
        </Accessories>

        <About>{car.about}</About>
      </Content>
      <Footer>
        <Button title="Escolha período do aluguel" onPress={handleConfirmRental} />
      </Footer>
    </Container>
  );
}