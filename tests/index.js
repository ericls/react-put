import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import App from './App';
import connectDisplay from '../es';

describe('<App />', () => {
  describe('connect with basic dictionary', () => {
    const options = {
      dictionary: {
        hello: '你好',
        welcome: name => `欢迎${name}`,
        haveApple: (name, amount) => `${name} has ${amount} ${amount === 1 ? 'apple' : 'apples'}`,
      },
    };
    const Component = connectDisplay(options)(App);
    const wrapper = shallow(<Component />);
    it('Should have display in props', () => {
      const display = wrapper.prop('display');
      expect(display).to.be.a('function');
    });
    it('Should correctly display strings', () => {
      const html = wrapper.html();
      expect(html).to.have.string('你好, 欢迎username');
      expect(html).to.have.string('username has 3 apples');
    });
  });
  describe('display based on props', () => {
    const options = {
      dictionary: {
        hello: '你好',
        welcome: name => `欢迎${name}`,
        haveApple: (name, amount) => `${name} has ${amount} ${amount === 1 ? 'apple' : 'apples'}`,
      },
      mapPropStateToDictionary: (props, states) => Object.assign({}, props, states),
    };
    const Component = connectDisplay(options)(App);
    const wrapper = shallow(<Component testKey={'someValue'} hello={'hello'} />);
    it('Should correctly display strings', () => {
      const html = wrapper.html();
      expect(html).to.have.string('hello, 欢迎username');
      expect(html).to.have.string('username has 3 apples');
      expect(html).to.have.string('someValue');
    });
  });
});
