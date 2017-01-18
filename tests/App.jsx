import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div>
        <p>{this.props.put('hello')}, {this.props.put('welcome', 'username')}</p>
        <p>{this.props.put('haveApple', 'username', 3)}</p>
        <p>{this.props.put('testKey')}</p>
        <button id="toHans">HANS</button>
      </div>
    );
  }
}

App.propTypes = {
  put: React.PropTypes.func.isRequired,
};

export default App;
