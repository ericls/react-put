import React, { Component } from 'react';

function cloneStatic(target, source) {
  const blackList = [ // from 'hoist-non-react-statics'
    'childContextTypes',
    'contextTypes',
    'defaultProps',
    'displayName',
    'getDefaultProps',
    'mixins',
    'propTypes',
    'type',
    'name',
    'length',
    'prototype',
    'caller',
    'arguments',
    'arity',
  ];
  const keys = Object.keys(source).filter(k => blackList.indexOf(k) === -1);
  const filteredSource = keys.reduce((acc, k) => ({ ...acc, [k]: source[k] }), {});
  return Object.assign(target, filteredSource);
}

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
            return { ...dictionary, ...mapPropToDictionary(_props || {}) };
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
    return cloneStatic(Put, ReactComponent);
  };
}

export default connectPut;
