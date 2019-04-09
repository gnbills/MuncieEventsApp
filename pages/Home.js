import React from 'react';
import EventList from "../EventList"
import {View, ImageBackground} from 'react-native';
import Styles from './Styles';
import APICacher from '../APICacher';
import TopBar from './top_bar';
import LoadingScreen from '../components/LoadingScreen';
import InternetError from '../components/InternetError';

export default class HomeScreen extends React.Component{
  constructor(props){
    super(props);
    this.state={url: 'https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ'};
    this.state = {isLoading: true,
                  failedToLoad: false};
    this._startupCachingAsync = this._startupCachingAsync.bind(this);
    this.APICacher = new APICacher();
  }  

      componentDidMount(){
        this._startupCachingAsync().catch(error => this.catchError())
      }

      catchError(){
        this.setState({failedToLoad:true, isLoading: false})
      }

      render(){
        console.log("We're getting close")
        if(this.state.isLoading){
          mainView = this.getLoadingScreen();
        }
        else if(this.state.failedToLoad){
          mainView = this.getErrorView();
        }
        else{
          mainView = this.getHomeView();
        }
        return(
          <View style={Styles.wrapper}>
            <View style={Styles.topBarWrapper}>
              <TopBar/>
            </View>
            <View style={Styles.mainViewContent}>
              {mainView}
            </View>
          </View>
          );
        }

      getErrorView(){
        return(
          <InternetError onRefresh = {() => {
            this.setState({isLoading:true, failedToLoad:false})
            this._startupCachingAsync().catch(error => this.catchError())
          }}/>
        );
      }

      getLoadingScreen(){
        return(
          <View>
            <LoadingScreen/>
          </View>
        );
      }

      async _startupCachingAsync(){
          key = "APIData"
          url = "https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
          hasAPIData = await this.APICacher._hasAPIData(key)
          if(hasAPIData){
           await this.APICacher._refreshJSONFromStorage(key, url)
          }
          if(!hasAPIData){
            await this.APICacher._cacheJSONFromAPIWithExpDate(key, url);
          }
          this.setState({isLoading:false})
      }

      getHomeView(){
        return(
            <View>
              <EventList/>
            </View>
            );
        }
  }