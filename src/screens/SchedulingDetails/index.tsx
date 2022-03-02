import React, { useCallback, useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";
import { Accessory } from "../../components/Accessory";
import { Button } from "../../components/Button";
import { format, parseISO } from "date-fns";
import { getAccessoryIcon } from "../../utils/getAccessoryIcon";

import { Alert } from "react-native";
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
} from "./styles";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { CarDTO } from "../../dtos/CarDTO";
import { useNavigation, useRoute } from "@react-navigation/core";
import { getPlatformDate } from "../../utils/getPlatformDate";
import api from "../../services/api";
import { useNetInfo } from "@react-native-community/netinfo";

interface Params {
  car: CarDTO;
  dates: string[];
}

interface RentalPeriodProps {
  start: string;
  end: string;
}

export function SchedulingDetails() {
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
  const netInfo = useNetInfo();
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriodProps>(
    {} as RentalPeriodProps
  );

  const route = useRoute();
  const { car, dates } = route.params as Params;

  const rentTotal = Number(dates.length * car.price);

  const handleConfirm = useCallback(async () => {
    setLoading(true);

    // const newDates = dates.map((date) => format(parseISO(date), "yyyy-MM-dd"));

    // const newStart = format(getPlatformDate(parseISO(dates[0])), "dd/MM/yyyy");
    // const newEnd = format(
    //   getPlatformDate(parseISO(dates[dates.length - 1])),
    //   "dd/MM/yyyy"
    // );

    await api
      .post("/rentals", {
        user_id: 1,
        car_id: car.id,
        start_date: new Date(dates[0]),
        end_date: new Date(dates[dates.length - 1]),
        total: rentTotal,
      })
      .then(() => {
        navigation.navigate("Confirmation", {
          title: "Carro alugado",
          message: `Agora você só precisa ir\naté a concessionário da RENTX\npegar o seu automóvel.`,
          nextScreenRoute: "Home",
        });
      })
      .catch(() => {
        Alert.alert("Não foi possível confirmar o agendamento");
        setLoading(false);
      });

    // api
    //   .put(`/schedules_bycars/${car.id}`, {
    //     id: car.id,
    //     unavailable_dates,
    //   })
    // .then(() => {
    //   navigate("Confirmation", {
    //     title: "Carro alugado",
    //     message: `Agora você só precisa ir\naté a concessionário da RENTX\npegar o seu automóvel.`,
    //     nextScreenRoute: "Home",
    //   });
    // })
    // .catch(() => {
    //   Alert.alert("Não foi possível confirmar o agendamento");
    //   setLoading(false);
    // });
  }, [car, dates]);

  useEffect(() => {
    if (dates.length > 0) {
      const newStart = parseISO(dates[0]);
      const newEnd = parseISO(dates[dates.length - 1]);
      setRentalPeriod({
        start: format(getPlatformDate(newStart), "dd/MM/yyyy"),
        end: format(getPlatformDate(newEnd), "dd/MM/yyyy"),
      });
    }
  }, [dates]);

  useEffect(() => {
    async function fetchCarUpdated() {
      const response = await api.get(`/cars/${car.id}`);
      setCarUpdated(response.data);
    }
    if (netInfo.isConnected === true) {
      fetchCarUpdated();
    }
  }, [netInfo.isConnected]);

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.navigate("Scheduling")} />
      </Header>
      <CarImages>
        <ImageSlider
          imagesUrl={
            !!carUpdated.photos
              ? carUpdated.photos
              : [{ id: car.thumbnail, photo: car.thumbnail }]
          }
        />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>{`R$ ${car.price}`}</Price>
          </Rent>
        </Details>

        {carUpdated.accessories && (
          <Accessories>
            {carUpdated.accessories.map((accessory) => (
              <Accessory
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))}
          </Accessories>
        )}

        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape.primary}
            />
          </CalendarIcon>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <Feather
            name="chevron-right"
            size={RFValue(12)}
            color={theme.colors.text.primary}
          />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
            <RentalPriceTotal>{`R$ ${rentTotal}`}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>
      <Footer>
        <Button
          title="Alugar agorar"
          onPress={handleConfirm}
          color={theme.colors.success.primary}
          enabled={!loading}
          loading={loading}
        />
      </Footer>
    </Container>
  );
}
