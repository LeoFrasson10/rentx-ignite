import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/core";
import { FlatList, StatusBar } from "react-native";
import { useTheme } from "styled-components";
import { Car as ModelCar } from "../../database/models/Car";
import { AntDesign } from "@expo/vector-icons";
import api from "../../services/api";
import { format, parseISO } from "date-fns";
import { LoadAnimation } from "../../components/LoadAnimation";
import { Car } from "../../components/Car";
import { BackButton } from "../../components/BackButton";

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
} from "./styles";

interface DataProps {
  id: string;
  car: ModelCar;
  start_date: string;
  end_date: string;
}

export function MyCars() {
  const [cars, setCars] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const screenIsFocused = useIsFocused();
  const navigate = useNavigation();
  const theme = useTheme();

  const loadCars = useCallback(async () => {
    try {
      const response = await api.get("/rentals");
      const dataFormatted = response.data.map((data: DataProps) => ({
        ...data,
        start_date: format(parseISO(data.start_date), "dd/MM/yyyy"),
        end_date: format(parseISO(data.end_date), "dd/MM/yyyy"),
      }));
      setCars(dataFormatted);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCars();
  }, [screenIsFocused]);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <BackButton
          onPress={() => navigate.goBack()}
          color={theme.colors.shape.primary}
        />

        <Title>
          Seus agendamentos,{`\n`}
          estão aqui
        </Title>

        <SubTitle>Conforto, segurança e praticidadde.</SubTitle>
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
                    <CarFooterDate>{item.start_date}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.text.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.end_date}</CarFooterDate>
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
