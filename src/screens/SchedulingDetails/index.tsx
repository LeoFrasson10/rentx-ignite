import React, { useCallback, useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';
import { format, parseISO } from 'date-fns' 
import { getAccessoryIcon } from '../../utils/getAccessoryIcon'; 

import { Alert } from 'react-native';
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
  Accessories,
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
import { CarDTO } from '../../dtos/CarDTO';
import { useRoute } from '@react-navigation/native';
import { getPlatformDate } from '../../utils/getPlatformDate';
import api from '../../services/api';


interface Params {
  car: CarDTO;
  dates: string[];
}

interface RentalPeriodProps {
  start: string;
  end: string;
}

export function SchedulingDetails({ navigation: { navigate, goBack } }: any){
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriodProps>({} as RentalPeriodProps)
  
  const route = useRoute()
  const { car, dates } = route.params as Params
  

  const rentTotal = Number(dates.length * car.rent.price)

  const handleConfirm = useCallback(async () => {
    setLoading(true)
    const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`)

    const newDates = dates.map((date) => format(parseISO(date), 'yyyy-MM-dd'))

    const newStart =  format(getPlatformDate(parseISO(dates[0])), 'dd/MM/yyyy')
    const newEnd = format(getPlatformDate(parseISO(dates[dates.length - 1])), 'dd/MM/yyyy')
    
    const unavailable_dates = [
      ...schedulesByCar.data.unavailable_dates,
      ...newDates
    ]

    await api.post('schedules_byuser', {
      user_id:1,
      car,
      startDate: newStart,
      endDate: newEnd
    })
    


    api.put(`/schedules_bycars/${car.id}`, {
      id: car.id,
      unavailable_dates
    }).then(() => {
      navigate('Confirmation', {
        title: "Carro alugado",
        message: `Agora você só precisa ir\naté a concessionário da RENTX\npegar o seu automóvel.`, 
        nextScreenRoute: 'Home'
      })
    }).catch(() =>{ 
      Alert.alert("Não foi possível confirmar o agendamento")
      setLoading(false)
    })   

  }, [car, dates])

  useEffect(() => {
    if(dates.length > 0){

      const newStart = parseISO(dates[0])
      const newEnd = parseISO(dates[dates.length - 1])
      setRentalPeriod({
        start: format(getPlatformDate(newStart), 'dd/MM/yyyy'),
        end: format(getPlatformDate(newEnd), 'dd/MM/yyyy')
      })
    }
  }, [dates])

  return (
    <Container>
      <Header>
        <BackButton onPress={ () => goBack()} />
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

        <RentalPeriod>
          <CalendarIcon>
            <Feather name="calendar" size={RFValue(24)} color={theme.colors.shape.primary} />
          </CalendarIcon>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <Feather name="chevron-right" size={RFValue(12)} color={theme.colors.text.primary} />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.rent.price} x${dates.length} diárias`}</RentalPriceQuota>
            <RentalPriceTotal>{`R$ ${rentTotal}`}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>

      </Content>
      <Footer>
        <Button title="Alugar agorar" onPress={handleConfirm} color={theme.colors.success.primary} enabled={!loading} loading={loading} />
      </Footer>
    </Container>
  );
}