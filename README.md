# react-put
[![Build Status](https://travis-ci.org/ericls/react-put.svg?branch=master)](https://travis-ci.org/ericls/react-put)
[![codecov](https://codecov.io/gh/ericls/react-put/branch/master/graph/badge.svg)](https://codecov.io/gh/ericls/react-put)


> A package that displays things in react components. Suitable for formatting and i18n.

[Interactive Demo](https://runkit.com/ericls/runkit-npm-react-put)

This package works by injecting a function (by default called `put`) into the props of a a connected react component. The injected function takes a `key` and optional context and returns something else (usually a string).

## Install

```bash
npm i --save react-put
```

## Examples:

The basic usage:
```javascript
// App.js
import connectPut from "react-put"

class App extends Component {
  render() {
    return (
      <div>
        <p>{this.props.put('hello')}, {this.props.put('welcome', 'username')}</p>
        <p>{this.props.put('haveApple', 'username', 3)}</p>
        <p>{this.props.put('testKey')}</p>
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
export default connectPut(options)(App);

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
        <p>{this.props.put('hello')}, {this.props.put('welcome', 'username')}</p>
        <p>{this.props.put('haveApple', 'username', 3)}</p>
        <p>{this.props.put('testKey')}</p>
        <button onClick={this.changeLanguage}>Change Language</button>
      </div>
    );
  }
}
const options = {
  mapPropToDictionary: props => Object.assign({}, props.dictionary),
};
const mapStateToProps = state => Object.assign({}, { dictionary: state.dictionary });
ConnectedApp = connectPut(options)(App);
ConnectedApp = connect(mapStateToProps)(ConnectedApp);
```

## Guide:

This package exposes a single function `connectPut` and is the default export of the package.

### connectPut():

```javascript
type Options = {
  dictionary?: Object,
  mapPropToDictionary?: (props: Object) => Object,
  putFunctionName?: string,
  notFound?: (key: string) => any
}
connectPut(options: Options)(Component) => Component
```


#### Options:

There are 4 optional keys in the options.

| key  | description |
| ------------- | ------------- |
| dictionary  | An object directly used by the injected function  |
| mapPropToDictionary  | A function that takes `props` of a component and returns an object that updates `dictionary`  |
| notFound  | A function that takes `key`, if (!(key in dictionary)), and returns something to display. (Defaults to key => \`$$${key}\`)  |
| putFunctionName  | A string that specifies the injected prop name. (Defaults to `put`)  |


### put():

The connected component will have a new props, which by default is called `put`.

```javascript
put(key, ...context) => any
```

This function looks up the `key` in dictionary and returns something to return accordingly.

If the value of the `key` is a string, a string is returned. If the value is a function, the function is called with `...context` and returns.
