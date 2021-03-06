import React from 'react';
import {View, TextInput, Text} from 'react-native';
import CustomButton from "./CustomButton";
import Styles from './Styles';
import InternetError from '../components/InternetError';
import APIKey from '../APIKey'

export default class ChangePassword extends React.Component {
    constructor(props){
        super(props);
        this.state = ({
                    userToken: "",
                    newPassword: "", 
                    confirmNewPassword: "", 
                    statusMessage: "",
                    passwordChanged: false,
                    failedToLoad:false,
                    passwordChanged:false
        })
        this.APIKey = new APIKey();

    }

    componentDidMount(){
        this.setState({userToken: this.props.userToken});
    }

    render(){
        renderedScreen = null
        if(this.state.failedToLoad){
            renderedScreen = this.getErrorMessage();
        }
        else if(!this.state.passwordChanged){
            renderedScreen = this.getChangePasswordScreen();
        }
        else{
            renderedScreen = (<Text style={Styles.centeredSingleItemText}>{this.state.statusMessage}</Text>)
        }
        return(renderedScreen)
    }

    getErrorMessage(){
        return(
            <InternetError onRefresh = {() => {
                this.setState({failedToLoad:false})
            }}/>
        );
    }

    getChangePasswordScreen(){
        return(
            <View>
                <TextInput 
                    onChangeText={(newPassword) => this.setState({newPassword})}
                    style={Styles.textBox}
                    placeholder="Enter new password"
                    value={this.state.newPassword}
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"/>
                <TextInput 
                    onChangeText={(confirmNewPassword) => this.setState({confirmNewPassword})}
                    style={Styles.textBox}
                    value={this.state.confirmNewPassword}
                    placeholder="Confirm new password"
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"/>
                <CustomButton 
                    text="Confirm" 
                    buttonStyle = {Styles.longButtonStyle}
                    textStyle = {Styles.longButtonTextStyle}
                    onPress = {()=>this.attemptUpdatePassword()}
                />
                <Text>{this.state.statusMessage}</Text>
            </View>
        )
    }

    attemptUpdatePassword(){
        if(!this.passwordsMatch()){
            this.setState({statusMessage: "ERROR: Passwords do not match"})
        }
        else if(this.state.newPassword.length < 1){
            this.setState({statusMessage: "ERROR: Empty passwords not allowed"})
        }        
        else{
            this.updatePassword();
        }
    }

    updatePassword(){
        fetch("https://api.muncieevents.com/v1/user/password?userToken=" + this.state.userToken + "&apikey="+this.APIKey.getAPIKey(), 
          {method: "PATCH",
          headers: {
                    Accept: 'application/vnd.api+json',
                    'Content-Type': 'application/json',
              },
          body: JSON.stringify({
            password: this.state.newPassword,
          })
      })
      .then((response) => response.json())
      .then((responseJson) => this.checkStatus(responseJson))
      .then(this.setState({statusMessage: "Password changed successfully", confirmNewPassword: "", newPassword: "", passwordChanged: true}))
        .catch((error) =>{
            if(!(error instanceof SyntaxError)){
                console.log(error)
                this.setState({failedToLoad:true, passwordChanged: false})
            }})
      }

    checkStatus(responseJson){
        try{
            this.setState({statusMessage: responseJson.errors[0].detail})
        }
        catch(error){}
    }

    passwordsMatch(){
        if(this.state.newPassword === this.state.confirmNewPassword){
            return true;
        }
        return false;
    }

}