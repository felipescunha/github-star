import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  hideSpinner() {
    this.setState({ visible: false });
  }

  render() {
    const { navigation } = this.props;
    const repository = navigation.getParam('repository');
    const { visible } = this.state;
    return (
      <>
        <WebView
          onLoad={() => this.hideSpinner()}
          source={{ uri: repository.html_url }}
        />
        {visible && (
          <ActivityIndicator
            size="large"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
            }}
          />
        )}
      </>
    );
  }
}
