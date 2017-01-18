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
        this.getDictionary = () => {
          if (mapPropToDictionary) {
            return Object.assign(
              {},
              dictionary,
              mapPropToDictionary(this.props || {}),
            );
          }
          return dictionary || {};
        };
        this.put = (key, ...context) => {
          const formatter = this.getDictionary()[key];
          if (formatter) {
            if (formatter instanceof Function) {
              return formatter(...context);
            }
            return formatter;
          }
          return notFound(key);
        };
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
