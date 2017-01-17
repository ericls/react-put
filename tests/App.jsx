import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div>
        <p>{this.props.display('hello')}, {this.props.display('welcome', 'username')}</p>
        <p>{this.props.display('haveApple', 'username', 3)}</p>
        <p>{this.props.display('testKey')}</p>
      </div>
    );
  }
}

App.propTypes = {
  display: React.PropTypes.func.isRequired,
};

export default App;
