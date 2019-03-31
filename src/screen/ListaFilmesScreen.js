import React, {Component} from 'react';
import { Text, View, TextInput, StyleSheet, Image, TouchableHighlight, ImageBackground, Alert } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { FlatList } from 'react-native-gesture-handler';
import { LPButton } from '../component/LPButton';

var db = openDatabase({ name: 'lapelicula.db' });

export default class ListaFilmesScreen extends Component {
  
  static navigationOptions = ({navigation}) => ({
    tabBarLabel: 'Lista Filmes',
    tabBarIcon: ({focused, tintColor}) => {
      if (focused){
        return(
          <Image source={require('../img/home_ativo.png')}
          style={{width: 26, height: 26}}/>
        );
      }else{
        return(
          <Image source={require('../img/home_inativo.png')}
          style={{width: 26, height: 26}}/>
        )
      }
    }
  });

  componentDidUpdate(prevProps) {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM filme ORDER BY descricao', [],
        (tx, res) => {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          if (deepDiffer(this.props.filmes, temp)) {
            this.setState({ filmes: temp });
          }
        });
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      filmes: []
    };
    this.editar = this.editar.bind(this);
    this.excluir = this.excluir.bind(this);
    this.eventoFilme = this.eventoFilme.bind(this);
    //buscar os dados dos filmes na base
    db.transaction(tx =>{
      tx.executeSql('SELECT * FROM filme ORDER BY descricao', [], (tx, res) => {
        //tratar o resultado da consulta
        var temp = [];
        //seta os filmes para exibir no flatlist
        for (let i =0; i < res.rows.length; i++){
          temp.push(res.rows.item(i));
        }
        this.setState({filmes: temp});;
      });
    });
  }

  eventoFilme(item) {
    Alert.alert(
      'Selecionado: ' + item.descricao,
      'Selecione a opçao',
      [
        {
          text: 'Editar', onPress: () => {
            this.props.navigation.navigate('Filme', { data: item })
          }
        },
        {
          text: 'Excluir', onPress: () => {db.transaction(tx => { tx.executeSql('DELETE FROM filme WHERE codigo = ?', [item.codigo],(tx, res) => {
          });
            });
            const newData = this.state.filmes.filter(itemLista => itemLista.codigo !== item.codigo);
            this.setState({ filmes: newData });
          }
        },
         { text: 'Cancelar', style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }

  editar(item) {
    alert(item.descricao);
  }

  excluir(item) {
    Alert.alert(
      'Excluir filme',
      'Deseja realmente excluir o filme: ' + item.descricao,
      [
        {  text: 'Não', style: 'cancel',
        },
        { text: 'Sim', onPress: () => { db.transaction(tx => { tx.executeSql('DELETE FROM filme WHERE codigo = ?', [item.codigo],
                (tx, res) => { });
            });
          }
        },
      ],
      { cancelable: false },
    );
  }

  buscasFilmes = async () => {
    fetch('http://www.omdbapi.com/?t=' + this.state.filmeOnline + '&apikey=3665cc2e')
      .then((response) => response.json())
      .then((responseJson) => {
        if (typeof responseJson.Title !== "undefined") {
          db.transaction(tx => {
            tx.executeSql('INSERT INTO filme(descricao,imagem) VALUES(?, ?)',
              [responseJson.Title, responseJson.Poster]);
          })
          alert('Filme cadastrado!');
        } else {
          alert('Filme não encontrado!');
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return(
      <View style={styles.container}>
        <TextInput style={styles.inputText}
          multiline={true} placeholder='Filmes'
          value={this.state.filmeOnline}
          onChangeText={(valor) => this.setState({ filmeOnline: valor })} />
        <LPButton titulo='Buscar filmes' onPress={() => this.buscasFilmes()} />
        <FlatList 
          data={this.state.filmes} 
          keyExtractor={item => item.codigo.toString()}  
          renderItem={({item}) => (
          <View style={styles.container}>
              <TouchableHighlight onPress={() => { this.eventoFilme(item) }} underlayColor="blue" >

                <ImageBackground resizeMode="cover" source={{ uri: item.imagem }} style={{ height: 150 }}>
                  <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end', paddingLeft: 10, paddingBottom: 10 }}>
                    <Text style={{ fontSize: 23, color: 'red', fontWeight: 'bold' }}>{item.descricao}</Text>
                  </View>
                </ImageBackground>
              </TouchableHighlight>
            </View>
        )}
        ></FlatList>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center'
  }
})