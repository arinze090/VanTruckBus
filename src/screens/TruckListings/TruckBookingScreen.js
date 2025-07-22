import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {HERE_API_KEY, GOOGLE_MAPS_PLACES_API_KEY} from '@env';
import debounce from 'lodash.debounce';
import polyline from '@mapbox/polyline';
import {useDispatch, useSelector} from 'react-redux';

import SafeAreaViewComponent from '../../components/common/SafeAreaViewComponent';
import HeaderTitle from '../../components/common/HeaderTitle';
import {windowWidth} from '../../utils/Dimensions';
import PickerSelect from '../../components/pickerSelect/PickerSelect';
import FormInput from '../../components/form/FormInput';
import ScrollViewSpace from '../../components/common/ScrollViewSpace';
import FixedBottomContainer from '../../components/common/FixedBottomContainer';
import FormButton from '../../components/form/FormButton';
import {
  extractTime,
  formatPriceRange,
  isPriceWithinRange,
  metersToKilometers,
  RNToast,
  formatToNaira,
  getCityAndCountry,
} from '../../Library/Common';
import {COLORS} from '../../themes/themes';
import {availableTimesForAppointmentDaily} from '../../data/dummyData';
import CountryPickerx from '../../components/pickerSelect/CountryPicker';
import axiosInstance from '../../utils/api-client';
import GoogleSearchInput from '../../components/form/GoogleSearchInput';

const TruckBookingScreen = ({route, navigation}) => {
  const item = route?.params;
  console.log('ddd', item);

  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const reduxLocationCoordinates = state?.user?.userLocationCoordinates;
  console.log('reduxLocationCoordinates', reduxLocationCoordinates);

  const today = moment().format('YYYY-MM-DD');

  const transformedBookingTimesData = availableTimesForAppointmentDaily?.map(
    item => ({
      label: item,
      value: item,
    }),
  );

  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);

  const [pickupTime, setPickupTime] = useState();
  const [overallPrice, setOverallPrice] = useState('');
  const [price, setPrice] = useState('');

  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [deliveryData, setDeliveryData] = useState('');
  const [pickupData, setPickupData] = useState('');
  const [description, setDescription] = useState('');

  // Error states
  const [formError, setFormError] = useState('');
  const [pickupTimeError, setPickupTimeError] = useState();
  const [priceError, setPriceError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  // geolocation states
  const [query, setQuery] = useState('');
  const [pickupCoords, setPickupCoords] = useState();
  const [dropOffCoords, setDropOffCoords] = useState();

  const [suggestions, setSuggestions] = useState([]);
  const [selectedQueryData, setSelectedQueryData] = useState();
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  console.log('routeInfo', routeInfo, pickupCoords, dropOffCoords);

  const handleDateSelect = day => {
    const date = day.dateString;

    console.log('dayyy', day, date);

    if (!moment(date).isBefore(today)) {
      setSelectedDate(date);
    } else {
      // If somehow a past date is selected (by a logic bug or manual intervention)
      setSelectedDate('');
      setAvailableTimes([]);
    }
  };

  const futureAvailability = selectedDate
    ? {
        [selectedDate]: {
          selected: true,
          selectedColor: COLORS.vtbBtnColor,
          selectedTextColor: '#ffffff',
        },
      }
    : {};

  const handleSelect = itemx => {
    console.log('Selected location:', itemx);
    setSelectedQueryData(itemx);
    setQuery(itemx?.title);
    setSuggestions([]);
  };

  const getRouteFromGoogle = async (origin, destination) => {
    console.log('originDataaaa: ', origin, destination);

    try {
      const originStr = `${origin.lat},${origin.lng}`;
      const destStr = `${destination.lat},${destination.lng}`;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&mode=driving&key=${GOOGLE_MAPS_PLACES_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log('data', data);
      console.log('dddd', data?.routes);

      if (data.status !== 'OK') {
        return console.error(data);
      }

      const points = data?.routes[0].overview_polyline.points;
      const decoded = polyline.decode(points).map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));

      const legEndLocation = data?.routes[0]?.legs[0]?.end_location;
      const newDropOffCoords = {
        latitude: legEndLocation.lat,
        longitude: legEndLocation.lng,
      };

      const duration = data?.routes[0]?.legs[0]?.duration?.value;
      const distance = data?.routes[0]?.legs[0]?.distance?.value;

      // Get city and country
      const originLocation = await getCityAndCountry(
        origin.lat,
        origin.lng,
        GOOGLE_MAPS_PLACES_API_KEY,
      );
      const destinationLocation = await getCityAndCountry(
        destination?.lat,
        destination?.lng,
        GOOGLE_MAPS_PLACES_API_KEY,
      );

      console.log('Origin City/Country:', originLocation);
      console.log('Destination City/Country:', destinationLocation);

      setPickupData(originLocation);
      setDeliveryData(destinationLocation);
      setRouteCoords(decoded);
      setRouteInfo({duration, distance});

      console.log('routesssss', duration, distance, decoded);
      // mapRef.current.fitToCoordinates(decoded, {
      //   edgePadding: { top: 60, right: 40, bottom: 60, left: 40 },
      //   animated: true,
      // });

      // navigation.navigate('MapsDisplayScreen', {
      //   routeCoords: decoded,
      //   pickoffCoords: pickupCoords,
      //   dropoffCoords: newDropOffCoords,
      //   routeInfo: {
      //     distance: distance,
      //     duration: duration,
      //   },
      // });
    } catch (err) {
      console.error('Google Routing Error', err);
    }
  };

  const bookAppointment = async () => {
    const bookingData = {
      truckInfo: item,
      listingId: item?.id,
      appointmentTime: {
        date: selectedDate,
        time: pickupTime,
      },
      description: description,
      price: overallPrice,
      pickupLocation: {
        address: pickupCoords?.address?.label,
        city: pickupData?.city,
        country: pickupData?.country,
      },
      deliveryLocation: {
        address: dropOffCoords?.address?.label,
        city: deliveryData?.city,
        country: deliveryData?.country,
      },

      status: 'request',
      reminders: [15, 60],
      negotiation: {
        proposedBy: 'user',
        userOffer: overallPrice,
        status: 'proposed',
      },
    };

    console.log('bookingData', bookingData);

    if (!selectedDate) {
      setFormError('Please select a date for your booking');
    } else if (!pickupTime) {
      setPickupTimeError('please select a time for your delivery');
    } else if (!overallPrice) {
      setPriceError('Please provide your locations to generate estimated fee');
    } else if (!description) {
      setDescriptionError('Please provide a brief description');
    } else {
      navigation.navigate('TruckBookingConfirmation', bookingData);
    }
  };

  useEffect(() => {
    if (pickupCoords && dropOffCoords) {
      getRouteFromGoogle(pickupCoords?.position, dropOffCoords?.position);
    }
  }, [pickupCoords, dropOffCoords]);

  useEffect(() => {
    if (routeInfo) {
      const durationInKm = metersToKilometers(routeInfo?.distance);
      const truckBasefare = item?.price?.[0];
      const overallPricee = durationInKm * truckBasefare;
      console.log(
        'overallPrice',
        overallPrice,
        truckBasefare,
        durationInKm,
        routeInfo,
      );
      setOverallPrice(formatToNaira(overallPricee?.toString()));
      setPrice(overallPrice);
    }
  }, [routeInfo]);

  return (
    <SafeAreaViewComponent>
      <HeaderTitle
        leftIcon={'arrow-back-outline'}
        onLeftIconPress={() => {
          navigation.goBack();
        }}
        rightIcon={''}
        headerTitle={'Truck Booking'}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingTop: 0}}>
        {/* <View style={{padding: 20, flexDirection: 'row'}}>
          <Image
            style={styles.tourguideBookingImage}
            source={{
              uri: item?.pictures[0]
                ? item?.pictures[0]
                : require('../../assets/3.jpg'),
            }}
          />
          <View
            style={{
              marginLeft: 10,
              width: windowWidth / 1.45,
              // backgroundColor: "red",
              justifyContent: 'space-between',
            }}>
            <Text numberOfLines={1} style={styles.tourguideBookingTitle}>
              {item?.car_name}
            </Text>
            <View style={styles.tourguideProfile2}>
              <Ionicons
                name="location-outline"
                size={15}
                style={{marginRight: 6}}
              />
              <Text>{item?.city}</Text>
            </View>
            <Text>{formatPriceRange(item?.price?.[0])}</Text>
          </View>
        </View> */}

        <Calendar
          onDayPress={handleDateSelect}
          markedDates={futureAvailability}
          theme={{
            arrowColor: COLORS.vtbBtnColor,
            todayTextColor: COLORS.vtbBtnColor,
            selectedDayBackgroundColor: COLORS.vtbBtnColor,
            selectedDayTextColor: '#ffffff',
            dotColor: COLORS.vtbBtnColor,
            textMonthFontWeight: 'bold',
            textMonthFontSize: 18,
          }}
          monthFormat={'MMMM yyyy'}
        />

        {selectedDate && (
          <View style={{marginTop: 20}}>
            <GoogleSearchInput
              formInputTitle={'Pickup Location'}
              onSelect={location => {
                console.log('User selected:', location);
                setPickupCoords(location);
              }}
            />

            <GoogleSearchInput
              formInputTitle={'Dropoff Location'}
              onSelect={location => {
                console.log('DropOffCoords selected:', location);
                setDropOffCoords(location);
              }}
            />

            <FlatList
              data={suggestions}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                    padding: 10,
                  }}>
                  <Text style={{color: 'black'}}>{item?.title}</Text>
                  {item?.address && (
                    <Text style={{color: '#888'}}>{item?.address?.label}</Text>
                  )}
                </TouchableOpacity>
              )}
            />

            <PickerSelect
              items={transformedBookingTimesData}
              placeholder={'Select your pickup time'}
              formInputTitle={'Select your preferred pickup time'}
              onValueChange={value => {
                setPickupTime(value);
                setFormError('');
                setPickupTimeError('');
              }}
              errorMessage={pickupTimeError}
            />

            <FormInput
              formInputTitle={'Estimated Price (naira)'}
              keyboardType={'number-pad'}
              placeholder="Enter your your price"
              value={overallPrice}
              errorMessage={priceError}
              editable={false}
            />

            <FormInput
              formInputTitle={'Brief Description'}
              keyboardType={'default'}
              placeholder="Enter your brief description"
              value={description}
              onChangeText={txt => {
                setDescription(txt);
                setDescriptionError('');
                setFormError('');
              }}
              errorMessage={descriptionError}
              numberOfLines={5}
              multiLine={true}
              height={100}
            />
          </View>
        )}

        <ScrollViewSpace />
      </ScrollView>

      {/* Buttons */}
      <FixedBottomContainer top={1.19}>
        <FormButton
          title={'Continue'}
          width={1.1}
          onPress={bookAppointment}
          disabled={loading}
          formError={formError}
          loading={loading}
        />
      </FixedBottomContainer>
    </SafeAreaViewComponent>
  );
};

export default TruckBookingScreen;

const styles = StyleSheet.create({
  tourguideBookingImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  tourguideBookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    // marginBottom: 10,
  },
  tourguideProfile2: {
    flexDirection: 'row',
    // marginTop: 10,
  },
});
