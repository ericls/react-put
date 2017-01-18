# react-display
[![Build Status](https://travis-ci.org/ericls/react-display.svg?branch=master)](https://travis-ci.org/ericls/react-display)
[![codecov](https://codecov.io/gh/ericls/react-display/branch/master/graph/badge.svg)](https://codecov.io/gh/ericls/react-display)


> A package that displays things in react components.


This package works by injecting a function (by default called `display`) into the props of a a connected react component. The injected function takes a `key` and optional context and returns something else (usually a string). Suitable for formatting and i18n.

## Examples:

The basic usage:
```javascript
// App.js
import connectDisplay from "react-display"

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
const options = {
  dictionary: {
    hello: '你好',
    welcome: name => `欢迎${name}`,
    haveApple: (name, amount) => `${name} has ${amount} ${amount === 1 ? 'apple' : 'apples'}`,
  },
  mapPropToDictionary: props => props, // You can do something wild with this option
};
export default connectDisplay(options)(App);

// test.js
import App from './App';

...
  render() {
    return <App testKey='someValue' />
  }
...

// renders:
<div>
  <p>你好, 欢迎username</p>
  <p>username has 3 apples</p>
  <p>someValue</p>
</div>


```

Here's an example of the usage with redux managed props:
```javascript
class App extends Component {
  constructor(props) {
    super(props);
    this.changeLanguage = () => {
      this.props.dispatch({ type: 'SET_DICT', dictionary: {...} }); // Assume SET_DICT is received by dictionary reducer
    };
  }
  render() {
    return (
      <div>
        <p>{this.props.display('hello')}, {this.props.display('welcome', 'username')}</p>
        <p>{this.props.display('haveApple', 'username', 3)}</p>
        <p>{this.props.display('testKey')}</p>
        <button onClick={this.changeLanguage}>Change Language</button>
      </div>
    );
  }
}
const options = {
  mapPropToDictionary: props => Object.assign({}, props.dictionary),
};
const mapStateToProps = state => Object.assign({}, { dictionary: state.dictionary });
ConnectedApp = connectDisplay(options)(App);
ConnectedApp = connect(mapStateToProps)(ConnectedApp);
```

## Guide:

This package exposes a single function `connectDisplay` and is the default export of the package.

### connectDisplay():

```javascript
type Options = {
  dictionary?: Object,
  mapPropToDictionary?: (props: Object) => Object,
  displayFunctionName?: string,
  notFound?: (key: string) => any
}
connectDisplay(options: Options)(Component) => Component
```


#### Options:

There are 4 optional keys in the options.

| key  | description |
| ------------- | ------------- |
| dictionary  | An object directly used by the injected function  |
| mapPropToDictionary  | A function that takes `props` of a component and returns an object that updates `dictionary`  |
| notFound  | A function that takes `key`, if (!(key in dictionary)), and returns something to display. (Defaults to key => \`$$${key}\`)  |
| displayFunctionName  | A string that specifies the injected prop name. (Defaults to `display`)  |


### display():

The connected component will have a new props, which by default is called `display`.

```javascript
display(key, ...context) => any
```

This function looks up the `key` in dictionary and returns something to return accordingly.

If the value of the `key` is a string, a string is returned. If the value is a function, the function is called with `...context` and returns.
