import 'jsdom-global/register';
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import App from './App';
import ReduxApp from './ReduxApp';
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
  describe('connect to props', () => {
    const options = {
      dictionary: {
        hello: '你好',
        welcome: name => `欢迎${name}`,
        haveApple: (name, amount) => `${name} has ${amount} ${amount === 1 ? 'apple' : 'apples'}`,
      },
      mapPropToDictionary: props => Object.assign({}, props),
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
  describe('connect to redux managed props', () => {
    const wrapper = mount(<ReduxApp />);
    it('Should correctly display strings before and after altering props', () => {
      let text = wrapper.text();
      expect(text).to.have.string('Hello, welcome username');
      expect(text).to.have.string('username has 3 apples');
      expect(text).to.have.string('someValue');
      wrapper.find('button').simulate('click');
      text = wrapper.text();
      expect(text).to.have.string('你好, 欢迎 username');
      expect(text).to.have.string('username 有 3 个苹果');
      expect(text).to.have.string('一些值');
    });
  });
});