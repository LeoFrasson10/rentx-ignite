import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import api from '../../services/api';
import Logo from '../../assets/logo.svg'

import { Car } from '../../components/Car';
import { CarDTO } from '../../dtos/CarDTO';

import {
  Container,
  Header,
  HeaderContent,
  TotalCars,
  CarList
} from './styles';
import { Load } from '../../components/Load';


export function Home({ navigation: { navigate, goBack } }: any){
  const [carsData, setCarsData] = useState<CarDTO[]>([])
  const [loading, setLoading] = useState(true)

  const handleCardDetails = useCallback((car: CarDTO) => () => {
    navigate('CarDetails', { car })
  }, [])

  const fetchCars = useCallback(async () => {
    try {
      const response= await api.get('/cars')
      setCarsData(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCars()
  }, [])

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor='transparent' translucent/>
      <Header>
        <HeaderContent>
          <Logo  width={RFValue(108)} height={RFValue(12)} />

          <TotalCars>
            {`Total de ${carsData.length} carros`}
          </TotalCars>
        </HeaderContent>
      </Header>
      { loading ? (
        <Load />
      ) : (
        <CarList 
          data={carsData}        
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <Car data={item} onPress={handleCardDetails(item)} />}
        />
      )}
    </Container>
  );
}