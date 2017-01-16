import React, { Component } from 'react';

function connectDisplay(options = {}) {
    let { notFound, displayFunctionName} = options;
    const { mapPropsToDictionary, dictionary } = options;
    notFound = notFound || ((key) => `$$${key}`);
    displayFunctionName = displayFunctionName || 'display';
    return (ReactComponent) => {
        class Display extends Component {
            constructor(props) {
                super(props);
                this.getDictionary = () => {
                    if (mapPropsToDictionary) {
                        return mapPropsToDictionary(this.props);
                    }
                    return dictionary || {};
                };
                this.display = (key, context = {}) => {
                    const formatter = this.getDictionary()[key];
                    if (formatter) {
                        if (formatter instanceof Function) {
                            return formatter(context);
                        }
                        return formatter;
                    }
                    return notFound(key);
                };
            }
            render() {
                const injectedProps = {[displayFunctionName]: this.display};
                return <ReactComponent {...this.props} {...this.state} {...injectedProps}/>;
            }
        }
        return Display;
    };
}

export default connectDisplay;
