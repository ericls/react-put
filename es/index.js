import React, { Component } from 'react';

function connectPut(options = {}) {
  let { notFound, putFunctionName } = options;
  const { mapPropToDictionary, dictionary } = options;
  notFound = notFound || (key => `$$${key}`);
  putFunctionName = putFunctionName || 'put';
  return (ReactComponent) => {
    class Put extends Component {
      constructor(props) {
        super(props);
        this.getDictionary = (_props) => {
          if (mapPropToDictionary) {
            return Object.assign(
              {},
              dictionary,
              mapPropToDictionary(_props || {}),
            );
          }
          return dictionary || {};
        };
        this.state = {
          dictionary: this.getDictionary(this.props),
        };
        this.put = (key, ...context) => {
          const formatter = this.state.dictionary[key];
          if (formatter) {
            if (formatter instanceof Function) {
              return formatter(...context);
            }
            return formatter;
          }
          return notFound(key);
        };
      }
      componentWillReceiveProps(props) {
        if (mapPropToDictionary) {
          this.setState({ dictionary: this.getDictionary(props) });
        }
      }
      render() {
        const injectedProps = { [putFunctionName]: this.put };
        return <ReactComponent {...this.props} {...this.state} {...injectedProps} />;
      }
    }
    return Put;
  };
}

export default connectPut;
