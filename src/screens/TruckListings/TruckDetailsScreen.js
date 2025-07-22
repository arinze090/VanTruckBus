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
import {formatPriceRange, formatToNaira} from '../../Library/Common';
import {COLORS} from '../../themes/themes';
import {truckExtraMessage} from '../../data/dummyData';

const TruckDetailsScreen = ({route, navigation}) => {
  const item = route?.params;
  console.log('item', item);

  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const userProfle = state?.user?.user;
  console.log('userProfle', userProfle);

  const [visible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(
    item?.selectedTruck ? item?.selectedTruck : item,
  );

  const transformedData = item?.pictures?.map(item => ({
    uri: item,
  }));

  const vehicleFeatures = [
    {
      icon: 'cube-outline',
      label: 'Load Capacity',
      value: `${item?.capacity} tons`,
    },
    {
      icon: 'resize-outline',
      label: 'Cargo Space',
      value: '40ft Container',
    },
    {
      icon: 'car-outline',
      label: 'Truck Type',
      value: item?.type,
    },
    {
      icon: 'speedometer-outline',
      label: 'Max Speed',
      value: '90 km/h',
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'Insurance',
      value: 'Fully Covered',
    },
    {
      icon: 'location-outline',
      label: 'GPS Tracking',
      value: 'Real-time',
    },
    {
      icon: 'cash-outline',
      label: 'Base Fare',
      value: `${formatToNaira(item?.price?.[0])}/km`,
    },
  ];

  const reviews = [
    {
      name: 'Mr. Jack',
      rating: 5.0,
      avatar:
        'https://res.cloudinary.com/rendezvouscare/image/upload/v1749761537/beard-5216825_1280_f7h4rw.jpg',
    },
    {
      name: 'Robert',
      rating: 4.8,
      avatar:
        'https://res.cloudinary.com/rendezvouscare/image/upload/v1749761537/beard-5216825_1280_f7h4rw.jpg',
    },
  ];

  const handleImageScroll = event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentImageIndex(Math.round(index));
  };

  const BookTruck = async () => {
    console.log('ddjdj');
    if (userProfle) {
      navigation.navigate('TruckBooking', selectedItem);
    } else {
      navigation.navigate('Login', {
        destination: 'TruckBooking',
        passedData: selectedItem,
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}>
            {selectedItem?.pictures?.map((image, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => setIsVisible(true)}>
                <Image source={{uri: image}} style={styles.carImage} />
              </TouchableOpacity>
            ))}
            <ImageView
              images={transformedData}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
          </ScrollView>

          {/* Heart/Favorite Button */}
          <TouchableOpacity activeOpacity={0.9} style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color="#666" />
          </TouchableOpacity>

          {/* Image Indicators */}
          <View style={styles.indicatorContainer}>
            {selectedItem?.pictures?.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.vehicleTitle}>{selectedItem?.car_name}</Text>
              <Text style={styles.vehicleDescription}>
                {selectedItem?.description}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>5.0</Text>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.reviewCount}>(25 reviews)</Text>
            </View>
          </View>

          {/* Owner/Driver Info */}
          <View style={styles.ownerSection}>
            <View style={styles.ownerInfo}>
              <Image
                source={{uri: item?.matchedDriverProfile?.profilePicture}}
                style={styles.ownerAvatar}
              />
              <View style={styles.ownerDetails}>
                <Text style={styles.ownerName}>
                  {item?.matchedDriverProfile?.fullName}
                </Text>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              </View>
            </View>
            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={COLORS.vtbBtnColor}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons
                  name="chatbubble-outline"
                  size={20}
                  color={COLORS.vtbBtnColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Car Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Car features</Text>
            <View style={styles.featuresGrid}>
              {vehicleFeatures?.map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name={feature.icon} size={24} color="#666" />
                  </View>
                  <Text style={styles.featureLabel}>{feature.label}</Text>
                  <Text style={styles.featureValue}>{feature.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Review (125)</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reviewsList}>
              {reviews?.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <Image
                    source={{uri: review?.avatar}}
                    style={styles.reviewerAvatar}
                  />
                  <View style={styles.reviewContent}>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <View style={styles.reviewRating}>
                      <Text style={styles.reviewRatingText}>
                        {review.rating}
                      </Text>
                      <Ionicons name="star" size={14} color="#FFD700" />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Additional Details */}

          {/* Extras Section */}
          <View style={styles.extrasSection}>
            <Text style={styles.sectionTitle}>Extras</Text>
            <Text style={styles.extrasText}>{truckExtraMessage}</Text>
          </View>
        </View>
      </ScrollView>

      <FixedBottomContainer top={1.17}>
        <FormButton
          title={'Book Now'}
          width={1.1}
          onPress={() => {
            BookTruck();
          }}
          marginBottom={0}
        />
      </FixedBottomContainer>
    </SafeAreaViewComponent>
  );
};

export default TruckDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 280,
  },
  carImage: {
    width: windowWidth,
    height: 280,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 15,
  },
  vehicleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  vehicleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ratingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
  },
  ownerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 25,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  ownerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 5,
  },
  contactButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  featuresSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (windowWidth - 60) / 3,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  featureValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  reviewsSection: {
    marginBottom: 30,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  reviewsList: {
    flexDirection: 'row',
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewContent: {
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 3,
  },
  detailsSection: {
    marginBottom: 30,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  extrasSection: {
    marginBottom: 100,
  },
  extrasText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
