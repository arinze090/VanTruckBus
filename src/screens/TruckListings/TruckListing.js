import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import SafeAreaViewComponent from '../../components/common/SafeAreaViewComponent';
import SearchBar from '../../components/search/SearchBar';
import VtbTruckCard from '../../components/cards/VtbTruckCard';
import ScrollViewSpace from '../../components/common/ScrollViewSpace';
import HeaderTitle from '../../components/common/HeaderTitle';
import axiosInstance from '../../utils/api-client';
import {saveTruckListings} from '../../redux/features/user/userSlice';
import {COLORS} from '../../themes/themes';

const TruckListing = ({navigation}) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const userProfle = state?.user?.user;
  console.log('userProfle', userProfle);

  const reduxTruckListings = state?.user?.truckListings;
  const trucksWithDriversAssigned = reduxTruckListings?.filter(
    trx => trx?.matchedDriverProfile,
  );
  console.log('trucksWithDriversAssigned', trucksWithDriversAssigned);
  console.log('reduxTruckListings', reduxTruckListings);

  const [loading, setLoading] = useState(false);

  const fetchTruckListings = async () => {
    try {
      const truckListingResponse = await axiosInstance.get(
        'api/listings/all-offerings',
      );
      let trucks = truckListingResponse?.data?.data || [];

      if (trucks) {
        const matchedResponses = truckListingResponse?.data?.data;

        const matchedResponseWithProfiles = await Promise.all(
          matchedResponses?.map(async listing => {
            const matchedDriverProfile = await getDriversProfile(
              listing?.driverId,
            );
            const truckOwnerProfile = await getTruckOwnerProfile(
              listing?.truckOwnerId,
            );

            return {
              ...listing,
              matchedDriverProfile,
              truckOwnerProfile,
            };
          }),
        );

        console.log(
          'matchedResponseWithProfiles :',
          matchedResponseWithProfiles,
        );
        setLoading(false);
        dispatch(saveTruckListings(matchedResponseWithProfiles));
      }
    } catch (error) {
      setLoading(false);
      console.log('fetchTruckListings error', error?.response?.data || error);
    }
  };

  const getDriversProfile = async driverId => {
    try {
      const response = await axiosInstance({
        url: `api/profile/driverprofiles/${driverId}`,
        method: 'GET',
      });
      console.log('getDriversProfile res', response?.data);
      return response?.data;
    } catch (error) {
      console.error(
        `getDriversProfile error for driverId ${driverId}:`,
        error?.response,
      );

      return null;
    }
  };

  const getTruckOwnerProfile = async truckOwnerId => {
    console.log('truckOwnerId', truckOwnerId);
    try {
      const response = await axiosInstance({
        url: `api/profile/truckprofiles/${truckOwnerId}`,
        method: 'GET',
      });
      console.log('getTruckOwnerProfile res', response?.data);
      return response?.data;
    } catch (error) {
      console.error(
        `getTruckOwnerProfile error for truckOwnerId ${truckOwnerId}:`,
        error?.response,
      );

      return null;
    }
  };

  const onRefresh = useCallback(() => {
    setLoading(true);
    fetchTruckListings();
  }, []);

  return (
    <SafeAreaViewComponent>
      <HeaderTitle headerTitle={'Vehicle Listings'} />
      <SearchBar searchPlaceholder={'Search trucks, vans, buses ...'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20}}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={COLORS.vtbBtnColor}
            style={{zIndex: 999}}
          />
        }>
        {trucksWithDriversAssigned?.map((cur, i) => (
          <VtbTruckCard
            key={i}
            props={cur}
            onPress={() => {
              navigation.navigate('TruckDetails', cur);
            }}
          />
        ))}

        <ScrollViewSpace />
      </ScrollView>
    </SafeAreaViewComponent>
  );
};

export default TruckListing;

const styles = StyleSheet.create({});
