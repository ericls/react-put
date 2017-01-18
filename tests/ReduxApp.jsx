import React, { Component } from 'react';
import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import connectPut from '../es';

const EN = {
  hello: 'Hello',
  welcome: name => `welcome ${name}`,
  testKey: 'someValue',
  haveApple: (name, amount) => `${name} has ${amount} ${amount === 1 ? 'apple' : 'apples'}`,
};

const HANS = {
  hello: '你好',
  welcome: name => `欢迎 ${name}`,
  testKey: '一些值',
  haveApple: (name, amount) => `${name} 有 ${amount} 个苹果`,
};

function dictionary(state = EN, action) {
  switch (action.type) {
    case 'SET_DICT':
      return action.dictionary;
    default:
      return state;
  }
}

const store = createStore(combineReducers({ dictionary }));

const mapStateToProps = state => Object.assign({}, { dictionary: state.dictionary });

class App extends Component {
  constructor(props) {
    super(props);
    this.clickHans = () => {
      this.props.dispatch({ type: 'SET_DICT', dictionary: HANS });
    };
  }
  render() {
    return (
      <div>
        <p>{this.props.put('hello')}, {this.props.put('welcome', 'username')}</p>
        <p>{this.props.put('haveApple', 'username', 3)}</p>
        <p>{this.props.put('testKey')}</p>
        <button id="toHans" onClick={this.clickHans}>HANS</button>
      </div>
    );
  }
}

App.propTypes = {
  put: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};

let ConnectedApp;

const options = {
  mapPropToDictionary: props => Object.assign({}, props.dictionary),
};
ConnectedApp = connectPut(options)(App);
ConnectedApp = connect(mapStateToProps)(ConnectedApp);


class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    );
  }
}

export default Root;
