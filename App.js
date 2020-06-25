import React, { Component, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Keyboard,
  Easing,
  TouchableOpacity,
  Modal,
  AsyncStorage,
  Linking,
} from 'react-native';
import { Dimensions } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal2 from 'react-native-modal';

import { Days_Count, GetHours, GetMinutes, GetMonth } from './Name.js';

var data = [];
var maxdays = 0;
var _Curr;
var pntrhour = 0;
var pntrmin = 0;


var lengthofItems;
var transasync;

const localNotification = {
  title: 'Reminder',
  body: '',
  android: {
    channelId: 'reminders',
    color: '#006aff',
    icon:
      'https://cdn4.iconfinder.com/data/icons/multimedia-75/512/multimedia-14-512.png',
    sound: true,
    priority: 'max',
    vibrate: [0, 250, 250, 250],
  },
};

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      day: new Date().getDay(),
      month: new Date().getMonth(),
      date: new Date().getDate(),
      year: new Date().getFullYear(),
      pressedkey: false,
      modalVisible: false,
      timepickervisible: false,
      message: '',
      alarmTime: '00:00',
      _time: new Date().getTime(),
      _id: [], // NOTIFICATIONS
      _Lnotiff: [], // NOTIFICATIONS
      _Lactivated: [], //NOTIFICATIONS
      _Lbody: [], //NOTIFICATIONS
      _pressedday: [], //NOTIFICATIONS
      l_item: [],
      l_index: [],
      key: 0,
    };
  }

  async _storeData(value) {
    try {
      var data = {
        body: this.state._Lbody.slice(-1)[0],
        notiff: this.state._Lnotiff.slice(-1)[0],
        activated: this.state._Lactivated.slice(-1)[0],
        pressedday: this.state._pressedday.slice(-1)[0],
        id: this.state._id.slice(-1)[0],
      };

      await AsyncStorage.setItem(
        data.id.toString(),
        data.body.toString() +
          '~' +
          data.notiff.toString() +
          '~' +
          data.activated.toString() +
          '~' +
          data.pressedday.toString()
      );
    } catch (error) {
      
    }
  }

  async _retrieveData(item) {
    try {
      const value = await AsyncStorage.getItem(item.toString());
      if (value !== null) {

        this.state._id.push(item.toString());

        transasync = value;
        let body = transasync.indexOf('~');
        transasync = transasync.slice(0, body);
        this.state._Lbody.push(transasync);

        transasync = value;
        let activated = transasync.indexOf('~', transasync.indexOf('~') + 1);
        transasync = transasync.slice(activated + 1);
        activated = transasync.indexOf('~');
        transasync = transasync.slice(0, activated);
        this.state._Lactivated.push(transasync);

        transasync = value;
        let notiff = transasync.indexOf('~', transasync.indexOf('~'));
        transasync = transasync.slice(notiff + 1);
        notiff = transasync.indexOf('~');
        transasync = transasync.slice(0, notiff);
        this.state._Lnotiff.push(transasync);

        transasync = value;
        let pressedday = transasync.indexOf('~', transasync.indexOf('~') + 1);
        transasync = transasync.slice(pressedday + 1);
        pressedday = transasync.indexOf('~');
        transasync = transasync.slice(pressedday + 1);
        this.state._pressedday.push(transasync);

        this.listofNotifications();
      }
    } catch (error) {
      
    }
  }
  async _synclistremove(item) {
    try {
      await AsyncStorage.removeItem(item.toString());

      const value = await AsyncStorage.getAllKeys();
      if (value !== null) {
      }
    } catch (error) {
      
    }
  }

  async _lengthofitems() {
    try {
      const value = await AsyncStorage.getAllKeys();
      lengthofItems = value.slice(-1)[0];

      for (let i = 1; i <= lengthofItems; i++) {
        this._retrieveData(i);
      }
    } catch (error) {
      
    }
  }

  cancelNotification() {
    Notifications.cancelAllScheduledNotificationsAsync();

    this.setState({ _Lbody: [] });
    this.setState({ _Lnotiff: [] });
    this.setState({ _Lactivated: [] });
    this.setState({ _pressedday: [] });
    this.setState({ _id: [] });
  }

  async changeTrue(item) {
    try {
      const value = await AsyncStorage.getItem(item.toString());
      if (value != null) {
        var transasync = value;
        transasync = transasync.replace('true_', 'true');
        await AsyncStorage.removeItem(item.toString());
        await AsyncStorage.setItem(item.toString(), transasync.toString());
        
      }
    } catch (error) {
     
    }
  }

  listofNotifications() {
    for (let i = 0; i < this.state._Lnotiff.length; i++) {
      
      if (this.state._Lactivated[i] === 'true_') {
        var str = this.state._Lnotiff[i].toString();

        let activated = str.indexOf(' ', str.indexOf(' '));
        str = str.slice(activated + 1);
        activated = str.indexOf(' ', str.indexOf(' '));
        str = str.slice(0, activated);
        let month = new Date().getMonth();

        var str2 = this.state._Lnotiff[i].toString();
        let activated2 = str2.indexOf(' ', str2.indexOf(' '));
        str2 = str2.slice(activated2 + 1);
        activated2 = str2.indexOf(' ');
        str2 = str2.slice(activated2);
        str2 = str2.slice(0, activated2);

        if (GetMonth(str) === month.toString()) {
          if (
            str2 == new Date().getDate() ||
            str2 == new Date().getDate() + 1
          ) {
            let item = this.state._id[i];
            this.changeTrue(item);
            this.state._Lactivated[i] === 'true';
            let schedulingOptions = {
              time: '',
            };
            schedulingOptions.time = this.state._Lnotiff[i];
            localNotification.body = this.state._Lbody[i];
            Notifications.scheduleLocalNotificationAsync(
              localNotification,
              schedulingOptions
            );
           
          }
        }
      }
    
    }
  }

  onSubmit() {
    localNotification.body = this.state.message;
    Keyboard.dismiss();

    let notiff = new Date(
      this.state.month +
        ' ' +
        _Curr +
        ',' +
        ' 20 ' +
        this.state.alarmTime +
        ':00 '
    );

    let schedulingOptions = {
      time: notiff.getTime(),
    };

    let val_id = this.state._id.slice(-1)[0];
    if (val_id == undefined) {
      val_id = 0;
    }

    this.state._id.push(val_id + 1);
    this.state._pressedday.push(_Curr);
    this.state._Lnotiff.push(notiff);
    this.state._Lactivated.push('true');
    this.state._Lbody.push(
      this.state.message + ' (' + this.state.alarmTime + ')'
    );

    this.state.l_item.push(
      this.state.message + ' (' + this.state.alarmTime + ')'
    );

    if (_Curr == new Date().getDate() || _Curr == new Date().getDate() + 1) {
      Notifications.scheduleLocalNotificationAsync(
        localNotification,
        schedulingOptions
      );
    } else {
      this.state._Lactivated.pop();
      this.state._Lactivated.push('true_');
    }

    this._storeData(this.state.message);

    this.setState({ message: '' });
    this.setState({ alarmTime: '00:00' });

    let tmp = _Curr;
    _Curr = tmp;
  }

  UNSAFE_componentWillMount() {
    this.getRightsAsyncNotifications();
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('reminders', {
        name: 'Reminder',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }

    this.FirstMonthDay();
    this.HandleDate();
    this._lengthofitems();


  }

  buttonPressed(item) {


    if (item !== '') {
      if (this.state.pressedkey === false) {
        this.setState({ pressedkey: true });
      }
      this.setState({ key: item });
      _Curr = item;
      this.setState({ l_item: [] });
      let y = [];
      for (let i = 0; i < this.state._Lbody.length; i++) {
        if (this.state._pressedday[i] == _Curr) {
          y.push(this.state._Lbody[i]);
        }
      }
      this.setState({ l_item: y });

    }
  }

  runallist(item, index) {
    let y;
    for (let i = 0; i < this.state._Lnotiff.length; i++) {
      if (this.state._Lbody[i] == item) {
        y = i;
      }
    }

    if (this.state._pressedday[y] == _Curr) {
      return <Text>{this.state._Lbody[y] + '\n'}</Text>;
    } else {
      return <Text />;
    }
  }
  runallist_2(item) {
    let y;
    for (let i = 0; i < this.state._Lnotiff.length; i++) {
      if (this.state._Lbody[i] == item) {
        y = i;
      }
    }
    if (this.state._pressedday[y] != _Curr) {
      return <Text />;
    } else {
      return <Text> ✖ </Text>;
    }
  }

  deactivatenotiff(item) {
    let y;
    for (let i = 0; i < this.state._Lnotiff.length; i++) {
      if (this.state._Lbody[i] == item) {
        y = i;
      }
    }
    if (
      this.state._Lactivated[y] === 'true' ||
      this.state._Lactivated[y] === 'true_'
    ) {
      this.state._Lactivated.splice(y, 1, 'false');
    }

    Notifications.cancelAllScheduledNotificationsAsync();

    let schedulingOptions = {
      time: '',
    };

    for (let i = 0; i < this.state._Lnotiff.length; i++) {
      if (this.state._Lactivated[i] == 'true') {
        schedulingOptions.time = this.state._Lnotiff[i];
        localNotification.body = this.state._Lbody[i];
        Notifications.scheduleLocalNotificationAsync(
          localNotification,
          schedulingOptions
        );
      } else if (this.state._Lactivated[i] == 'false') {
        this._synclistremove(this.state._id[i].toString());

        this.state._id.splice(i, 1);
        this.state._pressedday.splice(i, 1);
        this.state._Lnotiff.splice(i, 1);
        this.state._Lactivated.splice(i, 1);
        this.state._Lbody.splice(i, 1);

      }
    }

    this.forceUpdate();
  }

  async Currselected() {
  }
  async getRightsAsyncNotifications() {
    const { status, permissions } = await Permissions.askAsync(
      Permissions.NOTIFICATIONS
    );
    if (status === 'granted') {
    } else {
      throw new Error('permission not granted');
    }
  }
  HandleDate() {
    let year = new Date().getFullYear();
    var date = new Date(year, this.state.month, 1);

    var diff = '';
    if (date.getDay() === 0) {
      diff = 6;
    } else {
      diff = date.getDay() - 1;

    }

    for (var i = 0; i < maxdays; i++) {
      data[i] = i + 1;
    }

    for (i = 0; i < diff; i++) {
      data[i] = '';
  
    }
    for (i = diff; i < maxdays + diff; i++) {
      data[i] = i - diff + 1;
      if (data[i] === this.state.date) {
      }
    }
  }
  FirstMonthDay() {
    if (this.state.month === 0) {
      this.setState({ month: 'January' });
      maxdays = 31;
    } else if (this.state.month === 1) {
      this.setState({ month: 'February' });
      if (this.LeapYear() === true) {
        maxdays = 29;
      } else if (this.LeapYear() === false) {
        maxdays = 28;
      }
    } else if (this.state.month === 2) {
      this.setState({ month: 'March' });
      maxdays = 31;
    } else if (this.state.month === 3) {
      this.setState({ month: 'April' });
      maxdays = 30;
    } else if (this.state.month === 4) {
      this.setState({ month: 'May' });
      maxdays = 31;
    } else if (this.state.month === 5) {
      this.setState({ month: 'June' });
      maxdays = 30;
    } else if (this.state.month === 6) {
      this.setState({ month: 'July' });
      maxdays = 31;
    } else if (this.state.month === 7) {
      this.setState({ month: 'August' });
      maxdays = 31;
    } else if (this.state.month === 8) {
      this.setState({ month: 'September' });
      maxdays = 30;
    } else if (this.state.month === 9) {
      this.setState({ month: 'October' });
      maxdays = 31;
    } else if (this.state.month === 10) {
      this.setState({ month: 'November' });
      maxdays = 30;
    } else if (this.state.month === 11) {
      this.setState({ month: 'December' });
      maxdays = 31;
    }

  }
  NextMonth(next) {
    this.setState({ month: next }, () => {
      data = [];
      this.FirstMonthDay();
      this.HandleDate();
      this._lengthofitems();
    });
  }
  LeapYear() {
    return (
      (this.state.year % 4 == 0 && this.state.year % 100 != 0) ||
      this.state.year % 400 == 0
    );
  }
  showModal() {
    this.setState({ modalVisible: true });
  }
  hideModal() {
    this.setState({ modalVisible: false });
  }
  addAddress() {}
  showTimePicker() {
    this.setState({ timepickervisible: true });
  }
  hideTimePicker() {
    this.setState({ timepickervisible: false });
  }
  handleScrollhour(event) {
    pntrhour = Math.trunc(
      event.nativeEvent.contentOffset.y / Math.trunc(screenHeight * 0.26563)
    );
  }
  handleScrollmin(event) {
    pntrmin = Math.trunc(
      event.nativeEvent.contentOffset.y / Math.trunc(screenHeight * 0.26563)
    );
  }
  formatTime() {
    let zero = '0';
    if (pntrhour.toString().length < 2) {
      pntrhour = zero.concat(pntrhour);
    }
    if (pntrmin.toString().length < 2) {
      pntrmin = zero.concat(pntrmin);
    }
    this.setState({ alarmTime: pntrhour + ':' + pntrmin });
  }

  render() {
    return (
      <View style={styles.Back}>
        <View style={styles.upper2} />
        <View style={styles.upper} />
        <Text style={styles.title}>
          {this.state.month} {this.state.year}{' '}
        </Text>
        <View style={{ bottom: '6%' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity
              style={[styles.triangle, { transform: [{ rotate: '-90deg' }] }]}
              onPress={() => {
                if (GetMonth(this.state.month) > 0) {
                  let tmp = GetMonth(this.state.month);
                  let tmp2 = parseInt(tmp);
                  tmp2 -= 1;
                  this.NextMonth(tmp2);
                }
              }}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
            <TouchableOpacity
              style={[styles.triangle, { transform: [{ rotate: '90deg' }] }]}
              onPress={() => {
                if (GetMonth(this.state.month) < 11) {
                  let tmp = GetMonth(this.state.month);
                  let tmp2 = parseInt(tmp);
                  tmp2 += 1;
                  this.NextMonth(tmp2);
                }
              }}
            />
          </View>
        </View>

        <View style={{ flex: 0 }}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={Days_Count()}
            renderItem={({ item }) => (
              <View style={styles.calendar_head}>
                <View style={styles.mini_head}>
                  <Text style={styles.mini_head_text}>{item.toString()}</Text>
                </View>
              </View>
            )}
            numColumns={7}
          />
          <View
            style={{ borderBottomColor: '#828282', borderBottomWidth: 2 }}
          />
        </View>

        <View style={{ width: '100%', flex: 0 }}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={data}
            renderItem={({ item }) => (
              <View style={styles.calendar}>
                <TouchableOpacity
                  delayLongPress={0}
                  delayPressOut={0}
                  delayPressIn={0}
                  activeOpacity={1}
                  style={
                    item === this.state.date &&
                    GetMonth(this.state.month) ===
                      new Date().getMonth().toString()
                      ? styles.touchkey_current
                      : styles.touchkey
                  }
                  onPress={() => {
                    this.buttonPressed(item);
                  }}>
                  <View
                    style={
                      this.state.pressedkey === true && item === this.state.key
                        ? styles.circle
                        : styles.circle_2
                    }>
                    <Text style={styles.letters}>{item.toString()}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            numColumns={7}
          />
        </View>

        <View
          style={{
            width: '100%',
            top: '1%',
            height: '30%',
            backgroundColor: '#FFFFFF20',
          }}>
          <View style>
            <FlatList
              scrollEnabled={true}
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.l_item}
              extraData={this.state}
              renderItem={({ item, index }) => (
                <View style={{ backgroundColor: '#FFFFFF40' }}>
                  <Text style={{ textAlignVertical: 'top', fontSize: 22 }}>
                    {this.runallist(item, index)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.deactivatenotiff(item);
                    }}>
                    <View style={styles.cancel}>{this.runallist_2(item)}</View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>

        <View style={styles.addButton_View}>
          <TouchableOpacity
            style={styles.addButton_Button}
            onPress={() => {
              this.showModal();
              this.Currselected();
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                adjustsFontSizeToFit={true}
                style={{
                  textAlignVertical: 'center',
                  textAlign: 'center',
                  fontSize: 60,
                  marginBottom: '12%',
                }}>
                +
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.gearButton_View}>
          <TouchableOpacity
            style={styles.gearButton_Button}
            onPress={() => {
              Linking.openSettings();
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                adjustsFontSizeToFit={true}
                style={{
                  textAlignVertical: 'center',
                  textAlign: 'center',
                  fontSize: 25,
                  marginBottom: '5%',
                }}>
                ☰
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            marginBottom: '3%',
            marginRight: styles.addButton_Button.width * 1.3,
          }}
        />

        <View style={{ marginTop: 22 }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.hideModal();
            }}>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="always"
              scrollEnabled={false}
              style={{
                flex: 3,
                flexDirection: 'column',
                backgroundColor: '#91BFFF',
              }}>
              <View>
                <Text style={styles.title_modal}>Notes</Text>
                <TextInput
                  ref={input => {
                    this.textInput = input;
                  }}
                  placeholder="Type Here"
                  placeholderTextColor="#48494B"
                  onChangeText={message => this.setState({ message })}
                  value={this.state.message}
                  style={styles.textStyle}
                />
              </View>

              <View
                style={{
                  width: '100%',
                  height: '10%',
                  backgroundColor: '#FFFFFF50',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.showTimePicker();
                    pntrhour = 0;
                    pntrmin = 0;
                  }}
                  style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 40,
                      textAlign: 'center',
                      color: '#48494B',
                      flexWrap: 'wrap',
                      top: '5%',
                    }}>
                    {this.state.alarmTime}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flex: 1.6 / 4,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  flexWrap: 'wrap',
                  top: '5%',
                }}>
                <TouchableOpacity
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 200,
                    alignSelf: 'center',
                    backgroundColor: '#FFFFFF50',
                  }}
                  onPress={() => {
                    Keyboard.dismiss();
                    this.textInput.clear();
                    this.onSubmit();
                  }}>
                  <Text
                    style={{
                      textAlignVertical: 'center',
                      textAlign: 'center',
                      fontSize: 55,
                    }}>
                    ✓
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <Modal2
                  useNativeDriver={true}
                  isVisible={this.state.timepickervisible}
                  onBackdropPress={() => this.hideTimePicker()}
                  onBackButtonPress={() => this.hideTimePicker()}>
                  <View style={styles.modalStyle}>
                    <View style={{ height: '100%', right: '20%', top: '50%' }}>
                      <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        onScroll={this.handleScrollhour}
                        contentContainerStyle={{
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                        data={GetHours()}
                        horizontal={false} 
                        decelerationRate={'fast'} 
                        snapToInterval={Math.trunc(
                          styles.theyellow.height * 1.335
                        )}
                        snapToAlignment="center" 
                        renderItem={({ item }) => (
                          <View style={{ flex: 1 }}>
                            <View style={styles.theyellow} />
                            <View
                              style={{
                                height: Math.trunc(
                                  styles.theyellow.height * 0.335
                                ),
                                width: styles.theyellow.width * 2.5,
                                backgroundColor: '#91BFFF',
                              }}>
                              <View>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    fontSize: 33,
                                    color: 'black',
                                  }}>
                                  {item < 10
                                    ? '0' + item.toString()
                                    : item.toString()}{' '}
                                </Text>
                              </View>
                            </View>
                          </View>
                        )}
                      />
                    </View>
                    <View
                      style={{ height: '100%', left: '20%', bottom: '50%' }}>
                      <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        onScroll={this.handleScrollmin}
                        contentContainerStyle={{
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                        data={GetMinutes()}
                        horizontal={false} 
                        decelerationRate={'fast'} 
                        snapToInterval={Math.trunc(
                          styles.theyellow.height * 1.335
                        )}
                        snapToAlignment="center" 
                        renderItem={({ item }) => (
                          <View style={{ flex: 1 }}>
                            <View style={styles.theyellow} />
                            <View
                              style={{
                                height: Math.trunc(
                                  styles.theyellow.height * 0.335
                                ),
                                width: styles.theyellow.width * 2.5,
                                backgroundColor: '#91BFFF',
                              }}>
                              <View>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    fontSize: 33,
                                    color: 'black',
                                  }}>
                                  {item < 10
                                    ? '0' + item.toString()
                                    : item.toString()}{' '}
                                </Text>
                              </View>
                            </View>
                          </View>
                        )}
                      />
                    </View>

                    <View
                      style={{
                        width: '15%',
                        height: '15%',
                        backgroundColor: '#4392FF',
                        position: 'absolute',
                        left: '82%',
                        bottom: '81%',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.formatTime();
                          this.hideTimePicker();
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 33,
                            color: 'black',
                          }}>
                          ✓
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal2>
              </View>

              <View
                style={{
                  marginBottom: '100%',
                  top: styles.addButton_View.height,
                  flex: 1,
                  backgroundColor: '#FFFFFF50',
                }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    this.hideModal();
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 30,
                      bottom: '10%',
                    }}>
                    ✖
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Back: {
    width: '100%',
    height: '100%',
    backgroundColor: '#91BFFF',
  },
  upper: {
    width: '100%',
    height: '2.3%',
    backgroundColor: '#4392FF',
    borderColor: '#439EFF',
    borderBottomWidth: 5,
  },
  upper2: {
    width: '100%',
    height: '10%',
    backgroundColor: '#1371F5',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: '3%',
    textAlign: 'center',
    color: '#48494B',
  },
  calendar: {
    width: '13.27%',
    height: '50%',
    margin: '0.5%',
    flexWrap: 'nowrap',
  },
  calendar_head: {
    flex: 1,
    margin: '0.5%',
    flexWrap: 'nowrap',
  },
  mini_head: {
    flex: 1,
    margin: '0.5%',
    flexWrap: 'nowrap',
    backgroundColor: '#FFFFFF80',
  },
  mini_head_text: {
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 15,
  },
  touchkey: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF60',
    flex: 1,
    flexDirection: 'column',
    margin: '0.5%',
    alignSelf: 'stretch',
    padding: '20%',
  },
  touchkey_current: {
    alignItems: 'center',
    backgroundColor: '#ff000090',
    flex: 1,
    flexDirection: 'column',
    margin: '0.5%',
    alignSelf: 'stretch',
    padding: '20%',
  },
  circle: {
    width: '110%',
    height: '110%',
    borderRadius: 200,
    bottom: '23%',

    backgroundColor: '#ff000080',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  circle_2: {},
  letters: {
    top: '18%',
    alignItems: 'center',
  },
  addButton_View: {
    width: '95%',
    height: '10%',

    flexDirection: 'row',
    justifyContent: 'flex-end',
    bottom: '5%',
    position: 'absolute',

  },
  addButton_Button: {
    width: screenHeight * 0.1,
    height: '100%',
    borderRadius: 200,
    backgroundColor: '#FFFFFF80',
    position: 'absolute',
  },
  title_modal: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: '8%',
    textAlign: 'center',

    color: '#48494B',
  },
  textStyle: {
    width: '80%',
    alignSelf: 'center',
    height: '25%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 200,
    paddingLeft: '3%',
    paddingRight: '3%',
    backgroundColor: '#FFFFFF50',
  },
  modalStyle: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'white',
  },
  theyellow: {
    width: 50,
    height: Math.trunc(screenHeight * 0.2),
  },
  cancel: {
    backgroundColor: '#ff000080',
    alignItems: 'center',
  },
  gearButton_View: {
    width: '20%',
    height: '10%',

    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    bottom: '4%',
    position: 'absolute',
  },
  gearButton_Button: {
    width: screenHeight * 0.08,
    height: '80%',
    borderRadius: 200,
    backgroundColor: '#FFFFFF80',
    position: 'absolute',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#0269d4',
  },
});
