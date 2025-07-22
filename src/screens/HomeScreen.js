import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {HERE_API_KEY} from '@env';

import ScrollViewSpace from '../components/common/ScrollViewSpace';
import {
  saveTruckListings,
  saveUserLocationCoordinates,
} from '../redux/features/user/userSlice';
import axiosInstance, {baseURL} from '../utils/api-client';
import {COLORS} from '../themes/themes';
import {windowHeight, windowWidth} from '../utils/Dimensions';
import VtbTruckCard from '../components/cards/VtbTruckCard';
import {getTimeOfDayGreeting} from '../Library/Common';
import SearchBar from '../components/search/SearchBar';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const userProfle = state?.user?.user;
  console.log('userProfle', userProfle);

  const reduxTruckListings = state?.user?.truckListings;
  console.log('reduxTruckListings', reduxTruckListings);

  const trucksWithDriversAssigned = reduxTruckListings?.filter(
    trx => trx?.matchedDriverProfile,
  );
  console.log('trucksWithDriversAssigned', trucksWithDriversAssigned);

  const greeting = getTimeOfDayGreeting();
  const [loading, setLoading] = useState(false);

  const [userLiveAddress, setUserLiveAddress] = useState();
  const [coordinates, setCoordinates] = useState();

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

  const reverseGeocode = async (lat, lng) => {
    const apiKey = HERE_API_KEY;

    try {
      const res = await axios.get(
        'https://revgeocode.search.hereapi.com/v1/revgeocode',
        {
          params: {
            at: `${lat},${lng}`,
            apikey: apiKey,
          },
        },
      );

      console.log('reverseGeocode res:', res);

      const address = res?.data?.items?.[0]?.address?.label;
      setUserLiveAddress(address);
      console.log('Resolved address:', address);
      return address;
    } catch (error) {
      console.error('Reverse geocoding error:', error?.response);
      return null;
    }
  };

  useEffect(() => {
    fetchTruckListings();
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        console.log('Geolocationinfo', info);
        setCoordinates(info?.coords);
        reverseGeocode(info?.coords?.latitude, info?.coords?.longitude);

        // dispatch the coordinates to redux just incase its used elsewhere
        dispatch(saveUserLocationCoordinates(info?.coords));
      },
      error => {
        console.log('Geolocation error', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  return (
    <View style={{flex: 1}} showsVerticalScrollIndicator={false}>
      <View
        style={{
          backgroundColor: COLORS.vtbBtnColor,
          marginBottom: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}>
        <View style={styles.container}>
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.menuBorder} activeOpacity={0.9}>
              <Ionicons
                name="location-outline"
                size={25}
                color="black"
                onPress={() => {
                  navigation.openDrawer();
                }}
              />
            </TouchableOpacity>

            <View style={styles.profileDetails}>
              {/* <Text style={styles.profileName}>
                Hello,{' '}
                <Text style={{fontWeight: '600'}}>{userProfle?.fullname} </Text>
              </Text> */}
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 14,
                  color: 'white',
                  width: windowWidth / 2,
                  // backgroundColor: 'red',
                }}>
                {userLiveAddress}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="white"
              onPress={() => {
                navigation.navigate('Notification');
              }}
              style={{marginLeft: 24}}
            />
          </View>
        </View>
        <View
          style={{
            padding: 20,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 14, color: 'white', marginBottom: 10}}>
            {greeting}, {userProfle?.fullname}!
          </Text>
          <Text style={{fontSize: 22, color: 'white', fontWeight: '600'}}>
            Want to Book a Vehicle ?
          </Text>
        </View>
      </View>

      <SearchBar
        onPressIn={() =>
          navigation.navigate('MapsSearchScreen', {
            userLiveAddress: userLiveAddress,
            coordinates: coordinates,
          })
        }
        searchPlaceholder={'Where to'}
        searchIcon={'search-outline'}
      />

      {/* Carousel section */}
      {/* <Carousels /> */}

      {/* Popular Trucks */}
      <ScrollView
        contentContainerStyle={{padding: 20}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 14, fontWeight: '600'}}>
            Popular Vehicles
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              textDecorationLine: 'underline',
            }}>
            See More
          </Text>
        </View>
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
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    // backgroundColor: '#F7F7F7',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 40,
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 20,
  },
  profileDetails: {
    // alignItems: 'center',
    marginLeft: 10,
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 24,
    color: 'white',
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    color: '#000',
  },
  wallet: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.pinky,
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 6,
  },
  walletBalance: {
    color: 'black',
    fontWeight: '700',
    fontSize: 14,
    marginRight: 6,
  },
  menuBorder: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
  },
});
