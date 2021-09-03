import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { RectButton, PanGestureHandler } from 'react-native-gesture-handler';

import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, withSpring } from 'react-native-reanimated';

import api from '../../services/api';
import Logo from '../../assets/logo.svg'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from 'styled-components';
import { LoadAnimation } from '../../components/LoadAnimation';
import { Car } from '../../components/Car';
import { CarDTO } from '../../dtos/CarDTO';

import {
  Container,
  Header,
  HeaderContent,
  TotalCars,
  CarList,
  MyCarsButton
} from './styles';

const ButtonAnimated = Animated.createAnimatedComponent(RectButton)

export function Home({ navigation: { navigate, goBack } }: any){
  const [carsData, setCarsData] = useState<CarDTO[]>([])
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  // const positionY = useSharedValue(0)
  // const positionX = useSharedValue(0)

  // const myCarsButtonStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {translateX: positionX.value}, 
  //       {translateY: positionY.value}
  //     ]
  //   }
  // })
  
  // const onGestureEvent = useAnimatedGestureHandler({
  //   onStart(_, ctx: any){
  //     ctx.positionX = positionX.value;
  //     ctx.positionY = positionY.value;
  //   },
  //   onActive(event, ctx: any){
  //     positionX.value = ctx.positionX + event.translationX;
  //     positionY.value = ctx.positionY + event.translationY;
  //   },
  //   onEnd(){
  //     positionX.value = withSpring(0);
  //     positionY.value = withSpring(0);
  //   }
  // })

  const handleCardDetails = useCallback((car: CarDTO) => () => {
    navigate('CarDetails', { car })
  }, [])

  // const handleOpenMyCars = useCallback(() => {
  //   navigate('MyCars')
  // }, [])

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

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', () => {
  //     return true
  //   })
  // }, [])

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor='transparent' translucent/>
      <Header>
        <HeaderContent>
          <Logo  width={RFValue(108)} height={RFValue(12)} />

          {!loading && (
            <TotalCars>
              {`Total de ${carsData.length} carros`}
            </TotalCars>
          )}
        </HeaderContent>
      </Header>
      { loading ? (
        <LoadAnimation />
      ) : (
        <CarList 
          data={carsData}        
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <Car data={item} onPress={handleCardDetails(item)} />}
        />
      )}
      {/* <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[
            myCarsButtonStyle,
            {
              position: 'absolute',
              bottom: 13,
              right: 22
            }
          ]}
        >
          <ButtonAnimated onPress={handleOpenMyCars} style={[styles.button, { backgroundColor: theme.colors.main.primary}]}>
            <Ionicons name="ios-car-sport" size={32} color={theme.colors.shape.primary} />
          </ButtonAnimated>
        </Animated.View>
      </PanGestureHandler> */}
    </Container>
  );
}

// const styles = StyleSheet.create({
//   button: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center'
//   } 
// })