import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../themes/themes";

const ResendTimer = ({
  activeResend,
  resendingEmail,
  resendStatus,
  timeLeft,
  targetTime,
  resendEmail,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        alignContent: 'center',
        alignSelf: 'center',
      }}>
      <Text style={{color: '#000', fontSize: 14, fontWeight: '700'}}>
        Didn't get the code?
      </Text>
      {!resendingEmail && (
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!activeResend}
          style={{opacity: !activeResend && 0.5}}
          onPress={resendEmail}>
          <Text
            resendStatus={resendStatus}
            style={{textDecorationLine: 'underline'}}>
            {resendStatus}
          </Text>
        </TouchableOpacity>
      )}

      {resendingEmail && (
        <TouchableOpacity activeOpacity={0.9} disabled>
          <ActivityIndicator color="white" />
        </TouchableOpacity>
      )}

      {!activeResend && (
        <View>
          <Text
            style={{
              color: '#ccc',
              fontSize: 14,
              fontWeight: '700',
              marginLeft: 10,
              opacity: !activeResend && 0.5,
            }}>
            Resend in{' '}
            <Text style={{color: COLORS.vtbBtnColor}}>
              {timeLeft || targetTime}
            </Text>
          </Text>
        </View>
      )}

      {activeResend && (
        <TouchableOpacity activeOpacity={0.9} onPress={resendEmail}>
          <Text
            style={{
              color: COLORS.vtbBtnColor,
              fontSize: 14,
              fontWeight: '700',
              marginLeft: 10,
            }}>
            Resend
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ResendTimer;

const styles = StyleSheet.create({});
