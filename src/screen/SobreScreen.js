import React, {Component} from 'react';
import { Text, View, StyleSheet, Image, ImageBackground } from 'react-native';
import {LPButton} from '../component/LPButton';
import {StackActions, NavigationActions} from 'react-navigation';

export default class SobreScreen extends Component {
  //configurando tela de navegacao
  static navigationOptions = ({navigation}) => ({
    tabBarLabel: 'Sobre',
    tabBarIcon: ({focused, tintColor}) => {
      if (focused){
        return(
          <Image source={require('../img/cadastrar_ativo.png')}
          style={{width: 26, height: 26}}/>
        );
      }else{
        return(
          <Image source={require('../img/cadastrar_inativo.png')}
          style={{width: 26, height: 26}}/>
        )
      }
    }
  });

  constructor(props) {
    super(props);
    this.state = {};

    this.voltar = this.voltar.bind(this);
  }

  //passando para a proxima tela
  voltar(){
    this.props.navigation.goBack();
  }

  render() {
    return (
        <View style={styles.container}>
            <View style={styles.lista}>
                    <View style={styles.textoRender}>
                        <Text style={styles.descricao}>Trabalho da Pós LaPelicula</Text>
                    </View>              
                    <View style={styles.textoRender}>
                        <Text style={styles.descricao}>Academico: Anderson Rodrigo</Text>
                    </View>
                    <LPButton titulo="Voltar" onPress={() => {this.voltar()}}></LPButton>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lista: {
    justifyContent: 'center',
    backgroundColor: 'black',
    flex: 1
},
textoRender: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingBottom: 20
},
descricao: {
    fontSize: 23,
    color: 'white',
    fontWeight: 'bold'
}
})