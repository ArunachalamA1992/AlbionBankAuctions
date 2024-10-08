import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
  StyleSheet,
  Platform,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Color from '../../Config/Color';
import { Media } from '../../Global/Media';
import { Iconviewcomponent } from '../Icontag';
import { BottomSheet } from 'react-native-btr';

import { primarycolor } from '../../Utils/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { Poppins } from '../../Global/FontFamily';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setActionUserData,
  setLoginType,
  setPostPropertyLocation,
  setUserData,
} from '../../Redux';
import { StackActions } from '@react-navigation/native';
import { base_profile } from '../../Config/base_url';
import DeviceInfo from 'react-native-device-info';
import BottomLogin from '../BottomLogin';
import AuctionBottomLogin from '../../AuctionScreen/Auctioncomponents/AuctionBottomLogin';

const CustomDrawerContent = props => {
  const [itemSelected, setItemSelected] = useState('');
  const [selectCitybottomSheetVisible, setSelectCitybottomSheetVisible] =
    useState(false);
  const dispatch = useDispatch();
  const [loginEnable, setLoginEnable] = useState(false);
  const [AuctionloginEnable, setAuctionLoginEnable] = useState(false);
  const [maxRating, setMaxRating] = useState([
    {
      id: 1,
      rating: 1,
      experience: 'Poor',
    },
    {
      id: 2,
      rating: 2,
      experience: 'Bad',
    },
    {
      id: 3,
      rating: 3,
      experience: 'Okay',
    },
    {
      id: 4,
      rating: 4,
      experience: 'Average',
    },
    {
      id: 5,
      rating: 5,
      experience: 'Good',
    },
  ]);
  const Login_type = useSelector(state => state.UserReducer.Login_type);
  const userData = useSelector(state => state.UserReducer.userData);
  var {
    user_id,
    username,
    profile,
    user_type_id,
    mobile_number,
    email,
    post_quota,
  } = userData;
  const Auction_userData = useSelector(
    state => state.UserReducer.auctionUserData,
  );
  var { id, name, phone_number, email } = Auction_userData;
  const starImageCorner = Media.starOutline;
  const [defaultRating, setDefaultRating] = useState(null);
  const starImageFilled = Media.star;

  const onShare = async () => {
    try {
      const playStoreLink =
        'https://play.google.com/store/apps/details?id=com.albion&hl=en';

      const result = await Share.share({
        message: `Try Albion, your go-to housing app, and see how much better your house-hunting experience can be. You won't regret it.: ${playStoreLink}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with activity type: ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRatingPress = item => {
    if (defaultRating === item) {
      setDefaultRating(null);
    } else {
      setDefaultRating(item);
    }
  };

  function submitReview() {
    try {
      setSelectCitybottomSheetVisible(false);
      props.navigation.navigate('Home');
      ToastAndroid.show(
        'Your review will be update on Play Store',
        ToastAndroid.LONG,
      );
    } catch (error) {
      console.log('catch in submit_Review : ', error);
    }
  }

  function selectCity_toggleBottomView() {
    try {
      setSelectCitybottomSheetVisible(!selectCitybottomSheetVisible);
    } catch (error) {
      console.log(
        'catch in Home_interior selectCity_toggleBottomView :',
        error,
      );
    }
  }

  function selCity_BottomSheetmenu() {
    try {
      return (
        <View>
          <BottomSheet
            visible={selectCitybottomSheetVisible}
            onBackButtonPress={selectCity_toggleBottomView}
            onBackdropPress={selectCity_toggleBottomView}>
            <View
              style={{
                backgroundColor: Color.white,
                alignItems: 'center',
                borderTopStartRadius: 30,
                borderTopEndRadius: 30,
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  padding: 15,
                  paddingStart: 30,
                  backgroundColor: '#FBE9EF',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Color.lightBlack,
                    fontFamily: Poppins.SemiBold,
                  }}>
                  Rate Your Experience
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectCitybottomSheetVisible(false)}>
                  <Iconviewcomponent
                    Icontag={'AntDesign'}
                    iconname={'closecircleo'}
                    icon_size={22}
                    iconstyle={{ color: primarycolor, marginRight: 10 }}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.customRatingBarStyle}>
                {maxRating.map((item, index) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={index}
                      onPress={() => handleRatingPress(item.rating)}
                      style={{
                        marginHorizontal: 10,
                        alignItems: 'center',
                      }}>
                      <Image
                        style={styles.starImageStyle}
                        source={{
                          uri:
                            item.rating <= defaultRating
                              ? starImageFilled
                              : starImageCorner,
                        }}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 14,
                          color: Color.cloudyGrey,
                          marginVertical: 5,
                          fontFamily: Poppins.SemiBold,
                        }}>
                        {item.experience}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  // paddingVertical: 10,
                  marginVertical: 5,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 12,
                    color: Color.cloudyGrey,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  If You are Loving Our App Rate Us 5
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => submitReview()}
                style={{
                  width: '85%',
                  height: 45,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: primarycolor,
                  borderRadius: 5,
                  marginBottom: 10,
                }}>
                <Text style={{ fontSize: 14, color: 'white' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </BottomSheet>
        </View>
      );
    } catch (error) {
      console.log('catch in Home_interior selCity_BottomSheet_menu :', error);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
      <View>
        <View
          style={{
            backgroundColor: Color.primary,
            height: 200,
            padding: 10,
          }}>
          <View
            onPress={() => {
              props.navigation.navigate('ProfileTab');
            }}
            style={{
              justifyContent: 'center',
            }}>
            <Image
              source={{ uri: Media.Userpng }}
              style={{
                width: 100,
                height: 100,
                resizeMode: 'contain',
                borderRadius: 100,
              }}
            />

            {(Login_type == 'properties' && user_id == undefined) ||
              userData == undefined ? (
              <View
                style={{
                  marginVertical: 5,
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Color.white,
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 150,
                    padding: 10,
                  }}
                  onPress={() => {
                    setLoginEnable(true);
                  }}>
                  <Iconviewcomponent
                    Icontag={'AntDesign'}
                    iconname={'login'}
                    icon_size={20}
                    icon_color={Color.primary}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      marginLeft: 5,
                      color: Color.primary,
                      fontFamily: Poppins.Bold,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (Login_type == 'Auction' && id == undefined) ||
              Auction_userData == undefined ? (
              <View
                style={{
                  marginVertical: 5,
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Color.white,
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 150,
                    padding: 10,
                  }}
                  onPress={() => {
                    setAuctionLoginEnable(true);
                  }}>
                  <Iconviewcomponent
                    Icontag={'AntDesign'}
                    iconname={'login'}
                    icon_size={20}
                    icon_color={Color.primary}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      marginLeft: 5,
                      color: Color.primary,
                      fontFamily: Poppins.Bold,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: Color.white,
                    fontFamily: Poppins.Bold,
                    textTransform: 'capitalize',
                    marginVertical: 5,
                    marginHorizontal: 10,
                    marginVertical: Platform.OS == 'ios' ? 5 : 0,
                  }}
                  numberOfLines={1}>
                  {Login_type == 'properties'
                    ? username?.length != ''
                      ? username
                      : '*****'
                    : name?.length != ''
                      ? name
                      : '*****'}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: Color.white,
                    fontFamily: Poppins.SemiBold,
                    textTransform: 'capitalize',
                    marginHorizontal: 10,
                    marginVertical: Platform.OS == 'ios' ? 5 : 0,
                  }}>
                  {Login_type == 'properties' ? mobile_number : phone_number}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginVertical: 10, marginBottom: 50 }}>
          <View
            style={{
              backgroundColor:
                itemSelected === 'Home' ? primarycolor : Color.white,
              marginVertical: 5,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                paddingVertical: 10,
                padding: 10,
              }}
              onPress={() => {
                setItemSelected('Home');
                props.navigation.navigate('Home');
              }}>
              <Iconviewcomponent
                Icontag={'Ionicons'}
                iconname={itemSelected === 'Home' ? 'home' : 'home'}
                icon_size={itemSelected === 'Home' ? 22 : 18}
                icon_color={
                  itemSelected === 'Home' ? Color.white : Color.grey
                }
              />
              <Text
                style={{
                  fontSize: itemSelected === 'Home' ? 16 : 14,
                  width: 150,
                  marginLeft: 10,
                  color: itemSelected === 'Home' ? Color.white : Color.black,
                  fontFamily: itemSelected === 'Home' ? 'bold' : 'normal',
                }}>
                Home
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor:
                itemSelected === 'NotifyProperty'
                  ? primarycolor
                  : Color.white,
              marginVertical: 5,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                paddingVertical: 10,
                padding: 10,
              }}
              onPress={() => {
                setItemSelected('NotifyProperty'),
                  props.navigation.navigate('AuctionNotifyProperties');
              }}>
              <Iconviewcomponent
                Icontag={'MaterialIcons'}
                iconname={
                  itemSelected === 'NotifyProperty'
                    ? 'notification-add'
                    : 'notification-add'
                }
                icon_size={itemSelected === 'NotifyProperty' ? 22 : 18}
                icon_color={
                  itemSelected === 'NotifyProperty' ? Color.white : Color.grey
                }
              />
              <Text
                style={{
                  fontSize: itemSelected === 'NotifyProperty' ? 16 : 14,
                  width: 150,
                  marginLeft: 10,
                  color:
                    itemSelected === 'NotifyProperty'
                      ? Color.white
                      : Color.black,
                  fontFamily:
                    itemSelected === 'NotifyProperty' ? 'bold' : 'normal',
                }}>
                Notify Properties
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor:
                itemSelected === 'InterestedProperties'
                  ? primarycolor
                  : Color.white,
              marginVertical: 5,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                paddingVertical: 10,
                padding: 10,
              }}
              onPress={() => {
                setItemSelected('InterestedProperties'),
                  props.navigation.navigate('InterestedProperties');
              }}>
              <Iconviewcomponent
                Icontag={'MaterialCommunityIcons'}
                iconname={
                  itemSelected === 'InterestedProperties'
                    ? 'home-heart'
                    : 'home-heart'
                }
                icon_size={itemSelected === 'InterestedProperties' ? 22 : 18}
                icon_color={
                  itemSelected === 'InterestedProperties'
                    ? Color.white
                    : Color.grey
                }
              />
              <Text
                style={{
                  fontSize: itemSelected === 'InterestedProperties' ? 16 : 14,
                  width: 150,
                  marginLeft: 10,
                  color:
                    itemSelected === 'InterestedProperties'
                      ? Color.white
                      : Color.black,
                  fontFamily:
                    itemSelected === 'InterestedProperties'
                      ? 'bold'
                      : 'normal',
                }}>
                Interested Properties
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor:
                itemSelected === 'AdvanceSearch' ? primarycolor : Color.white,
              marginVertical: 5,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                paddingVertical: 10,
                padding: 10,
              }}
              onPress={() => {
                setItemSelected('AdvanceSearch');
                props.navigation.navigate('AdvanceSearch');
              }}>
              <Iconviewcomponent
                Icontag={'AntDesign'}
                iconname={
                  itemSelected === 'AdvanceSearch' ? 'search1' : 'search1'
                }
                icon_size={20}
                icon_color={
                  itemSelected === 'AdvanceSearch' ? Color.white : Color.grey
                }
              />
              <Text
                style={{
                  fontSize: itemSelected === 'AdvanceSearch' ? 16 : 14,
                  width: 150,
                  marginLeft: 10,
                  color:
                    itemSelected === 'AdvanceSearch'
                      ? Color.white
                      : Color.black,
                  fontWeight:
                    itemSelected === 'AdvanceSearch' ? 'bold' : 'normal',
                }}>
                Advance Search
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor:
                itemSelected === 'AuctionAboutUs'
                  ? primarycolor
                  : Color.white,
              marginVertical: 5,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                paddingVertical: 10,
                padding: 10,
              }}
              onPress={() => {
                setItemSelected('AuctionAboutUs');
                props.navigation.navigate('AuctionAboutUs');
              }}>
              <Iconviewcomponent
                Icontag={'Ionicons'}
                iconname={
                  itemSelected === 'AuctionAboutUs'
                    ? 'information-circle'
                    : 'information-circle-outline'
                }
                icon_size={20}
                icon_color={
                  itemSelected === 'AuctionAboutUs' ? Color.white : Color.grey
                }
              />

              <Text
                style={{
                  fontSize: itemSelected === 'AuctionAboutUs' ? 16 : 14,
                  width: 150,
                  marginLeft: 10,
                  color:
                    itemSelected === 'AuctionAboutUs'
                      ? Color.white
                      : Color.black,
                  fontWeight:
                    itemSelected === 'AuctionAboutUs' ? 'bold' : 'normal',
                }}>
                About Us
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor:
                itemSelected === 'AuctionContact'
                  ? primarycolor
                  : Color.white,
              marginVertical: 5,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                paddingVertical: 10,
                padding: 10,
              }}
              onPress={() => {
                setItemSelected('AuctionContact');
                props.navigation.navigate('AuctionContactUs');
              }}>
              <Iconviewcomponent
                Icontag={'Ionicons'}
                iconname={
                  itemSelected === 'AuctionContact' ? 'call' : 'call-outline'
                }
                icon_size={20}
                icon_color={
                  itemSelected === 'AuctionContact' ? Color.white : Color.grey
                }
              />

              <Text
                style={{
                  fontSize: itemSelected === 'AuctionContact' ? 16 : 14,
                  width: 150,
                  marginLeft: 10,
                  color:
                    itemSelected === 'AuctionContact'
                      ? Color.white
                      : Color.black,
                  fontWeight:
                    itemSelected === 'AuctionContact' ? 'bold' : 'normal',
                }}>
                Contact Us
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor:
                itemSelected === 'FAQs' ? primarycolor : Color.white,
              marginVertical: 5,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                paddingVertical: 10,
                padding: 10,
              }}
              onPress={() => {
                setItemSelected('FAQs'),
                  props.navigation.navigate('AuctionFAQs');
              }}>
              <Iconviewcomponent
                Icontag={'Ionicons'}
                iconname={
                  itemSelected === 'FAQs'
                    ? 'information-circle'
                    : 'information-circle-outline'
                }
                icon_size={20}
                icon_color={
                  itemSelected === 'FAQs' ? Color.white : Color.grey
                }
              />

              <Text
                style={{
                  fontSize: itemSelected === 'FAQs' ? 16 : 14,
                  width: 150,
                  marginLeft: 10,
                  color: itemSelected === 'FAQs' ? Color.white : Color.black,
                  fontWeight: itemSelected === 'FAQs' ? 'bold' : 'normal',
                }}>
                FAQs
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor:
                itemSelected === 'RateReviews' ? primarycolor : Color.white,
              marginVertical: 5,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                paddingVertical: 10,
                padding: 10,
              }}
              onPress={() => {
                setItemSelected('RateReviews'), selectCity_toggleBottomView();
              }}>
              <Iconviewcomponent
                Icontag={'AntDesign'}
                iconname={itemSelected === 'RateReviews' ? 'star' : 'staro'}
                icon_size={itemSelected === 'RateReviews' ? 26 : 20}
                icon_color={
                  itemSelected === 'RateReviews' ? Color.white : Color.grey
                }
              />

              <Text
                style={{
                  fontSize: itemSelected === 'RateReviews' ? 16 : 14,
                  width: 150,
                  marginLeft: 10,
                  color:
                    itemSelected === 'RateReviews'
                      ? Color.white
                      : Color.black,
                  fontWeight:
                    itemSelected === 'RateReviews' ? 'bold' : 'normal',
                }}>
                Rate & Reviews
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor:
                itemSelected === 'AuctionPrivacyPolicy'
                  ? primarycolor
                  : Color.white,
              marginVertical: 5,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                paddingVertical: 10,
                padding: 10,
              }}
              onPress={() => {
                setItemSelected('AuctionPrivacyPolicy');
                props.navigation.navigate('AuctionPrivacyPolicy');
              }}>
              <Iconviewcomponent
                Icontag={'MaterialIcons'}
                iconname={
                  itemSelected === 'AuctionPrivacyPolicy'
                    ? 'policy'
                    : 'policy'
                }
                icon_size={20}
                icon_color={
                  itemSelected === 'AuctionPrivacyPolicy'
                    ? Color.white
                    : Color.grey
                }
              />

              <Text
                style={{
                  fontSize: itemSelected === 'AuctionPrivacyPolicy' ? 16 : 14,
                  width: 150,
                  marginLeft: 10,
                  color:
                    itemSelected === 'AuctionPrivacyPolicy'
                      ? Color.white
                      : Color.black,
                  fontWeight:
                    itemSelected === 'AuctionPrivacyPolicy'
                      ? 'bold'
                      : 'normal',
                }}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor:
                itemSelected === 'AuctionTerms' ? primarycolor : Color.white,
              marginVertical: 5,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                paddingVertical: 10,
                padding: 10,
              }}
              onPress={() => {
                setItemSelected('AuctionTerms');
                props.navigation.navigate('AuctionTermsConditions');
              }}>
              <Iconviewcomponent
                Icontag={'MaterialCommunityIcons'}
                iconname={
                  itemSelected === 'AuctionTerms'
                    ? 'content-save-all'
                    : 'content-copy'
                }
                icon_size={20}
                icon_color={
                  itemSelected === 'AuctionTerms' ? Color.white : Color.grey
                }
              />
              <Text
                style={{
                  fontSize: itemSelected === 'AuctionTerms' ? 16 : 14,
                  width: 150,
                  marginLeft: 10,
                  color:
                    itemSelected === 'AuctionTerms'
                      ? Color.white
                      : Color.black,
                  fontWeight:
                    itemSelected === 'AuctionTerms' ? 'bold' : 'normal',
                }}>
                Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>


          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              paddingHorizontal: 10,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 14, color: '#00961A' }}>
              App version : {DeviceInfo.getVersion()}
            </Text>
          </View>

          {selCity_BottomSheetmenu()}
        </View>
      </ScrollView>


      {loginEnable == true && (
        <BottomLogin login={loginEnable} setLogin={setLoginEnable} />
      )}
      {AuctionloginEnable == true && (
        <AuctionBottomLogin
          login={AuctionloginEnable}
          setLogin={setAuctionLoginEnable}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  customRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  starImageStyle: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
});

export default CustomDrawerContent;
