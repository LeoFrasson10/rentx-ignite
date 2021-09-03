import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { CarDTO } from '../../dtos/CarDTO';
import { AntDesign } from '@expo/vector-icons'
import api from '../../services/api';

import { LoadAnimation } from '../../components/LoadAnimation';
import { Car } from '../../components/Car';
import { BackButton } from '../../components/BackButton';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from './styles';

interface CarProps {
  id: string;
  user_id: string;
  car: CarDTO;
  startDate: string;
  endDate: string;
}

export function MyCars({ navigation: { navigate, goBack } }: any){
  const [cars, setCars] = useState<CarProps[]>([])
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  const loadCars = useCallback(async () => {
    try { 
      const response = await api.get('/schedules_byuser?user_id=1')
      setCars(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    
  }, [])

  useEffect(() => {
    loadCars()
  }, [])
  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor='transparent' translucent />
      <Header>
        <BackButton onPress={() => goBack()} color={theme.colors.shape.primary} />

        <Title>
          Seus agendamentos,{`\n`}
          estão aqui
        </Title>

        <SubTitle>
          Conforto, segurança e praticidadde.
        </SubTitle>

      </Header>
    
      {loading ? (
        <LoadAnimation />
      ) : (      
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>

          <FlatList 
            data={cars || []}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car data={item.car} />

                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign 
                      name="arrowright"
                      size={20}
                      color={theme.colors.text.title}
                      style={{ marginHorizontal: 10}}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            )}
          />
        </Content>
      )}
    </Container>
  );
}