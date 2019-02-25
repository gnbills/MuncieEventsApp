import React from 'react';
import EventList from "../EventList"
import {TextInput, View, Text} from 'react-native';
import CustomButton from "./CustomButton";
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import Styles from './Styles';
import {AppLoading} from 'expo';
import APICacher from '../APICacher';


export default class HomeScreen extends React.Component{
  constructor(props){
    super(props);
    this.state={text: ''};
    this.state={url: 'https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ'};
    this.state = {isReady: false};
    this._startupCachingAsync = this._startupCachingAsync.bind(this);
    this.APICacher = new APICacher();
  }  
      render(){
        if(!this.state.isReady){
          return(
            <AppLoading 
              startAsync={this._startupCachingAsync}
              onFinish={() => this.setState({ isReady: true })}
              onError= {console.error}
            />
          );
        }
        else{
          return(
            <View style={Styles.topBarPadding}>
              <View style={Styles.topBarWrapper}>
                <Animatable.View animation = "slideInRight" duration={500} style={Styles.topBarContent}>
                    <CustomButton
                        text="Menu"
                        onPress={() => this.props.navigation.openDrawer()}/>
                    <TextInput
                        placeholder=' Search'
                        value={this.state.text} 
                        style={Styles.searchBar}
                        onChangeText={(text) => this.setState({text})}
                        onBlur={() => this.setState({url:'https://api.muncieevents.com/v1/events/search?q=' + this.state.text +  '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'})}
                        showLoading='true'
                      />
                    <Icon name="ios-search" style={Styles.iosSearch}/>
                  </Animatable.View>
                </View>
              <Text style={Styles.title}>
                EVENTS
              </Text>
              <View>
                <EventList/>
              </View>
            </View>
          );
        }
      } 

      async _startupCachingAsync(){
          hasAPIData = await this.APICacher._hasAPIData("APIData")
          if(!hasAPIData){
            await this.APICacher._cacheJSONFromAPIAsync("APIData", this.state.url)
          }
      }

}