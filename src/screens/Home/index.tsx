import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, Button } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useNetInfo } from "@react-native-community/netinfo";
import { RectButton, PanGestureHandler } from "react-native-gesture-handler";
import { synchronize } from "@nozbe/watermelondb/sync";
import { database } from "../../database";
import { Car as ModelCar } from "../../database/models/Car";
import { useNavigation } from "@react-navigation/core";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from "react-native-reanimated";

import api from "../../services/api";
import Logo from "../../assets/logo.svg";
import { useTheme } from "styled-components";
import { LoadAnimation } from "../../components/LoadAnimation";
import { Car } from "../../components/Car";
// import { CarDTO } from "../../dtos/CarDTO";

import {
  Container,
  Header,
  HeaderContent,
  TotalCars,
  CarList,
  // MyCarsButton,
} from "./styles";

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

export function Home() {
  const [carsData, setCarsData] = useState<ModelCar[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const netInfo = useNetInfo();
  const navigation = useNavigation<any>();

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

  const handleCardDetails = useCallback(
    (car: ModelCar) => () => {
      navigation.navigate("CarDetails", { car });
    },
    []
  );

  // const handleOpenMyCars = useCallback(() => {
  //   navigate('MyCars')
  // }, [])

  async function offlineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const { data } = await api.get(
          `/cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`
        );

        const { changes, latestVersion } = data;
        // console.log("changes", changes);
        return { changes, timestamp: latestVersion };
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        await api.post("/users/sync", user).catch(console.log);
      },
    });
  }

  useEffect(() => {
    let isMounted = true;
    async function fetchCars() {
      try {
        // const response = await api.get("/cars");
        const carCollection = database.collections.get<ModelCar>("cars");
        const cars = await carCollection.query().fetch();

        if (isMounted) {
          setCarsData(cars);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCars();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (netInfo.isConnected === true) {
      offlineSynchronize();
    }
  }, [netInfo.isConnected]);

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', () => {
  //     return true
  //   })
  // }, [])

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />

          {!loading && (
            <TotalCars>{`Total de ${carsData.length} carros`}</TotalCars>
          )}
        </HeaderContent>
      </Header>

      {loading ? (
        <LoadAnimation />
      ) : (
        <CarList
          data={carsData}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Car data={item} onPress={handleCardDetails(item)} />
          )}
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
