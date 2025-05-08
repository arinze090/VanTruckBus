import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-viewing';
import {useDispatch, useSelector} from 'react-redux';

import SafeAreaViewComponent from '../../components/common/SafeAreaViewComponent';
import HeaderTitle from '../../components/common/HeaderTitle';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import DetailsOption from '../../components/common/DetailsOption';
import FixedBottomContainer from '../../components/common/FixedBottomContainer';
import FormButton from '../../components/form/FormButton';
import {formatPriceRange} from '../../Library/Common';

const TruckDetailsScreen = ({route, navigation}) => {
  const item = route?.params;
  console.log('item', item);

  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const userProfle = state?.user?.user;
  console.log('userProfle', userProfle);

  const [visible, setIsVisible] = useState(false);

  const transformedData = item?.pictures?.map(item => ({
    uri: item,
  }));

  const BookTruck = async () => {
    if (userProfle) {
      navigation.navigate('TruckBooking', item);
    } else {
      navigation.navigate('Login', {
        destination: 'TruckBooking',
        passedData: item,
      });
    }
  };

  return (
    <SafeAreaViewComponent>
      <HeaderTitle
        headerTitle={'Vehicle Details'}
        leftIcon={'arrow-back-outline'}
        onLeftIconPress={() => {
          navigation.goBack();
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            padding: 10,
          }}>
          {item?.pictures?.map((cur, i) => (
            <View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{flexDirection: 'row', marginRight: 10}}
                onPress={() => {
                  setIsVisible(true);
                }}>
                <Image
                  key={i}
                  source={{uri: cur}}
                  style={styles.tourdetailsImage}
                />
              </TouchableOpacity>
              <ImageView
                images={transformedData}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
              />
            </View>
          ))}
        </ScrollView>
        <DetailsOption label={'Truck Name'} value={item?.car_name} />
        <DetailsOption label={'Truck Type'} value={item?.type} />
        <DetailsOption label={'Truck Model'} value={item?.model} />
        <DetailsOption label={'Location'} value={item?.location} />
        <DetailsOption
          label={'Price Range'}
          value={formatPriceRange(item?.price?.[0])}
        />

        <View style={{padding: 10}}>
          <Text style={{fontSize: 18, fontWeight: '500', marginBottom: 10}}>
            Extras
          </Text>
          <Text style={{fontSize: 12, color: '#333', marginBottom: 10}}>
            Every vehicle booked through our platform comes with a dedicated
            driver and a trained assistant (also known as a load carrier). These
            personnel are assigned to ensure the safe handling, swift loading,
            and timely delivery of your goods. The driver manages the
            transportation logistics, while the assistant provides hands-on
            support with lifting, organizing, and unloading items at your
            delivery destination — helping to guarantee a smooth and stress-free
            delivery experience for both inter- and intra-state bookings.
          </Text>
        </View>
      </ScrollView>

      <FixedBottomContainer top={1.2}>
        <FormButton
          title={'Book Now'}
          width={1.1}
          onPress={() => {
            BookTruck();
          }}
          marginBottom={0}
          //   disabled={!email || !password || loading}
          //   formError={formError}
          //   loading={loading}
        />
      </FixedBottomContainer>
    </SafeAreaViewComponent>
  );
};

export default TruckDetailsScreen;

const styles = StyleSheet.create({
  tourdetailsImage: {
    width: windowWidth / 1.2,
    height: windowHeight / 5,
    borderRadius: 10,
    marginBottom: 10,
  },
});
