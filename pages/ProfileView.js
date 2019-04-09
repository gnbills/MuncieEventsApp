import React from 'react';
import {View, TextInput, Text} from 'react-native';
import CustomButton from "./CustomButton";
import Styles from './Styles';
import EventList from '../EventList';
import APICacher from '../APICacher';
import LoadingScreen from '../components/LoadingScreen';
import ChangePassword from './ChangePassword'
import InternetError from '../components/InternetError';
import MailingList from './MailingList'

export default class ProfileView extends React.Component {
    constructor(props){
        super(props);
        this.state = ({email: "", 
                      name: "", 
                      statusMessage: "", 
                      userid: "",
                      token: "",
                      usereventsurl: "", 
                      usereventsresponsejson: "",
                      changePassword: false,
                      isLoading: true,
                      mailingList: false,
                      failedToLoad:false});
                      //this._startupCachingAsync = this._startupCachingAsync.bind(this);
                      this.APICacher = new APICacher();
      }

      render(){
        contentView = null
        eventsView = null
        if(this.state.isLoading){
            eventsView= this.getLoadingView()
        }
        else if(this.state.failedToLoad){
          contenView = this.getErrorMessage()
        }
        else if(this.state.changePassword){
            contentView = (<View>
                              <ChangePassword userToken={this.state.token}/>
                              <CustomButton 
                                  text="Go Back" 
                                  buttonStyle = {Styles.longButtonStyle}
                                  textStyle = {Styles.longButtonTextStyle}
                                  onPress = {()=>this.setState({changePassword: false})}
                              />
                          </View>)
        }
        else if(this.state.mailingList){
          contentView = this.getMailingListView()
        }
        else{
          eventsView=(<View style={Styles.profileViewEvents}>
            <Text style={Styles.title}>EVENTS</Text>
            <EventList useSearchResults = {true} />
          </View>)
          if(!this.state.email && this.state.userid){
              this.fetchUserData(this.state.userid)
              this.fetchUserEventsData()
          }
          else if(this.state.userid){
              contentView = this.getProfileInformation();
          }
        }
          return(
            <View>
                {contentView}
                {eventsView}
            </View>
        );
      }

      getErrorMessage(){
        return(
          <InternetError onRefresh={()=> {
            this.setState({failedToLoad: false, changePassword:false, isLoading:true})
          }}/>
        );
      }

      getLoadingView(){
        return(
          <LoadingScreen/>
        );
      }

      getMailingListView(){
        return(
              <View>
                  <MailingList userToken={this.state.token}/>
                  <CustomButton 
                      text="Go Back" 
                      buttonStyle = {Styles.longButtonStyle}
                      textStyle = {Styles.longButtonTextStyle}
                      onPress = {()=>this.setState({mailingList: false})}
                    />
              </View>

        )
      }

      componentDidMount(){
        url = "https://api.muncieevents.com/v1/user/" + this.props.userid + "/events?apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1";
        this.setState({userid: this.props.userid, token: this.props.token,
        usereventsurl: url});
        this._startupCachingAsync(url);
      }

      fetchUserData(userid){
        fetch("https://api.muncieevents.com/v1/user/" + userid + "?apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1")        
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            email: responseJson.data.attributes.email,
            name: responseJson.data.attributes.name
          });
        })
        .catch((error) =>{
          this.setState({failedToLoad:true})
        });
      } 

      updateUserData(){
        fetch("https://api.muncieevents.com/v1/user/profile?userToken=" + this.state.token + "&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1", 
          {method: "PATCH",
          headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/json',
            },
          body: JSON.stringify({
              email: this.state.email, 
              name: this.state.name,
          })
      })
      .then((response)=>responseJson = response.json())
      .then((responseJson)=>console.log(responseJson))
        .catch((error) =>{
           console.log(error)
           this.setState({statusMessage: "Error reaching server: " + error})
        })
      }

      async _startupCachingAsync(url){
        try{
          key = "SearchResults"
          await this.APICacher._cacheJSONFromAPIAsync(key, url)
          this.setState({isLoading:false});
        }
        catch(error){
          this.setState({failedToLoad:true})
        }
    }

      fetchUserEventsData(){
        console.log(this.state.usereventsurl)
        fetch(this.state.usereventsurl)        
        .then((responseJson) => {
          this.setState({
            usereventsresponsejson: responseJson
          });
        })
        .catch((error) =>{
          this.setState({failedToLoad:true})
        });
      } 

      getProfileInformation(){
          return(
              <View>
                <TextInput
                    onChangeText={(name) => this.setState({name})}
                    style={Styles.textBox}
                    value={this.state.name}
                />          
                <TextInput
                    onChangeText={(email) => this.setState({email})}
                    style={Styles.textBox}
                    value={this.state.email}
                />
                <CustomButton 
                    text="Update" 
                    buttonStyle = {Styles.longButtonStyle}
                    textStyle = {Styles.longButtonTextStyle}
                    onPress = {()=>this.updateUserData()}
                />
                <CustomButton 
                    text="Change Password" 
                    buttonStyle = {Styles.longButtonStyle}
                    textStyle = {Styles.longButtonTextStyle}
                    onPress = {()=>this.setState({changePassword: true})}
                />
                <CustomButton 
                    text="Edit Mailing List Settings" 
                    buttonStyle = {Styles.longButtonStyle}
                    textStyle = {Styles.longButtonTextStyle}
                    onPress = {()=>{this.setState({mailingList: true})}}
                />
              </View>
          )
      }
}