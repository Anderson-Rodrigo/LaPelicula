import {createStackNavigator, createAppContainer, createBottomTabNavigator, createSwitchNavigator} from 'react-navigation';
import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar, AsyncStorage, StyleSheet } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
//criar objeto pra representar banco de dados
var db = openDatabase({
  name: 'lapelicula.db'
});

import LoginScreen from './src/screen/LoginScreen';
import ListaFilmesScreen from './src/screen/ListaFilmesScreen';
import FilmeScreen from './src/screen/FilmeScreen';
import SobreScreen from './src/screen/SobreScreen';
import CameraScreen from './src/screen/CameraScreen';

class LoginLoadingScreen extends Component {
  constructor(props) {
    super(props);

    this.bootstrapAsync = this.bootstrapAsync.bind(this);

    this.bootstrapAsync();
    //criar as tabelas do banco
    db.transaction(function (tx){
      //codigos
      tx.executeSql('SELECT name FROM sqlite_master WHERE type = \'table\' AND name = \'filme\'', [], function(tx, res){
        if(res.rows.length == 0){
          tx.executeSql('CREATE TABLE filme(codigo INTEGER PRIMARY KEY AUTOINCREMENT, descricao VARCHAR(200), imagem blob)', []); 
          tx.executeSql('INSERT INTO filme(descricao) VALUES (\'filme 01\')', []);
          tx.executeSql('INSERT INTO filme(descricao) VALUES (\'filme 02\')', []);
          tx.executeSql('INSERT INTO filme(descricao) VALUES (\'filme 03\')', []); 
          tx.executeSql('INSERT INTO filme(descricao) VALUES (\'filme 04\')', []);
          tx.executeSql('INSERT INTO filme(descricao) VALUES (\'filme 05\')', []);
          tx.executeSql('INSERT INTO filme(descricao) VALUES (\'filme 06\')', []);
        }
      });
    });
 }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync() {
    let logado = 'false';
    AsyncStorage.getItem('logado').then((value) => {
      logado = value;
    });

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(logado == 'true' ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
//criar navegador stack
// const NavegadorStack = createStackNavigator({
//   Home: { screen: HomeScreen },
//   Login: { screen: LoginScreen },
//   Sobre: { screen: SobreScreen}
// });

//navegador por tab
const AppTab = createBottomTabNavigator({
  Home: { screen: ListaFilmesScreen },
  Filme: { screen: FilmeScreen },
  Sobre: { screen: SobreScreen }
}, {
  tabBarOptions: {
    activeTintColor: '#FFFFFF',
    inactiveTintColor: '#CCCCCC',
    style: {
      backgroundColor: '#570076'
    },
    indicatorStyle: {
      backgroundColor: null
    }
  }
});

//criando navegador stack
const AppStack = createStackNavigator(
  {
    Login: LoginScreen,
    Camera: CameraScreen
  }
);

//criando navegador swtich(ecolha) -- tudo da aplicacao mapeia no app
const AppSwitch = createSwitchNavigator(
  {
    LoginLoading: LoginLoadingScreen,
    App: AppTab,
    Auth: AppStack  
  }, {
    initialRouteName: 'LoginLoading'
  }
);

//container principal da aplicacao
const App = createAppContainer(AppSwitch);
export default App;