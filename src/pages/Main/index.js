import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  ViewButtons,
  DeleteButton,
} from './styles';

export default class Main extends Component {
  static navigationOptions = () => ({
    title: 'Rocketseat | Desafio 06',
  });

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    inputUserPlaceHolder: 'Adicionar usuário',
    inputUserNotfound: false,
    loading: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.user !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const { users, newUser } = this.state;
    if (newUser === '') {
      this.setState({
        inputUserNotfound: true,
        inputUserPlaceHolder: 'Digite o nome do usuário!',
        newUser: '',
        loading: false,
      });
      return;
    }
    this.setState({ loading: true });
    try {
      const response = await api.get(`/users/${newUser}`);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
      });
    } catch (e) {
      this.setState({
        inputUserNotfound: true,
        inputUserPlaceHolder: 'Não localizamos este usuário!',
        newUser: '',
        loading: false,
      });
    }
    Keyboard.dismiss();
  };

  handleFocusUserInput = () => {
    this.setState({
      inputUserNotfound: false,
      inputUserPlaceHolder: 'Adicionar usuário',
    });
  };

  handleNavigate = user => {
    const { navigation } = this.props;

    navigation.navigate('User', { user });
  };

  handleDelete = item => {
    const { users } = this.state;

    this.setState({
      users: users.filter(u => u.login !== item.login),
    });
  };

  render() {
    const {
      users,
      newUser,
      loading,
      inputUserNotfound,
      inputUserPlaceHolder,
    } = this.state;
    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            inputUserNotfound={inputUserNotfound}
            placeholder={inputUserPlaceHolder}
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
            onFocus={this.handleFocusUserInput}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>
        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ViewButtons>
                <ProfileButton onPress={() => this.handleNavigate(item)}>
                  <ProfileButtonText>Ver perfil</ProfileButtonText>
                </ProfileButton>
                <DeleteButton onPress={() => this.handleDelete(item)}>
                  <Icon name="delete" size={20} color="#fff" />
                </DeleteButton>
              </ViewButtons>
            </User>
          )}
        />
      </Container>
    );
  }
}
