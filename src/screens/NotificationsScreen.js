import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import SafeAreaViewComponent from '../components/common/SafeAreaViewComponent';
import axiosInstance from '../utils/api-client';
import HeaderTitle from '../components/common/HeaderTitle';
import NotificationsCard from '../components/cards/NotificationsCard';
import ScrollViewSpace from '../components/common/ScrollViewSpace';

const NotificationsScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      await axiosInstance({
        url: 'api/notification',
        method: 'GET',
      })
        .then(res => {
          console.log('fetchNotifications res', res?.data);
          setLoading(false);

          setNotifications(res?.data?.data?.notifications);
        })
        .catch(err => {
          console.log('fetchNotifications err', err?.response);
          setLoading(false);
        });
    } catch (error) {
      console.log('fetchNotifications error', error?.response);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchNotifications();
    }

    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <SafeAreaViewComponent>
      <HeaderTitle
        headerTitle={'Notifications'}
        leftIcon={'arrow-back-outline'}
        onLeftIconPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 10}}>
        {loading ? (
          <Text style={styles.loadingText}>
            Please wait while we fetch your data
          </Text>
        ) : notifications?.length ? (
          notifications?.map((cur, i) => (
            <NotificationsCard key={i} props={cur} />
          ))
        ) : (
          <Text style={styles.loadingText}>
            You currently have no notification at the moment
          </Text>
        )}

        <ScrollViewSpace />
      </ScrollView>
    </SafeAreaViewComponent>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  loadingText: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
});
