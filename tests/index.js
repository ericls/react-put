import 'jsdom-global/register';
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import App from './App';
import ReduxApp from './ReduxApp';
import connectPut from '../es';

describe('<App />', () => {
  describe('connect with basic dictionary', () => {
    const options = {
      dictionary: {
        hello: '你好',
        welcome: name => `欢迎${name}`,
        haveApple: (name, amount) => `${name} has ${amount} ${amount === 1 ? 'apple' : 'apples'}`,
      },
    };
    const Component = connectPut(options)(App);
    const wrapper = shallow(<Component />);
    it('Should have put in props', () => {
      const put = wrapper.prop('put');
      expect(put).to.be.a('function');
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
    const Component = connectPut(options)(App);
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
  describe('functional component, custom putFunctionName and notFound options', () => {
    const options = {
      dictionary: {
        hello: '你好',
        welcome: name => `欢迎${name}`,
        haveApple: (name, amount) => `${name} has ${amount} ${amount === 1 ? 'apple' : 'apples'}`,
      },
      putFunctionName: 'translate',
      notFound: key => `a wild ${key}`,
    };
    const TestApp = (props) => {
      const translate = props.translate;
      return (
        <div>
          <p>{translate('hello')}, {translate('welcome', 'username')}</p>
          <p>{translate('haveApple', 'username', 3)}</p>
          <p>{translate('testKey')}</p>
        </div>
      );
    };
    TestApp.propTypes = {
      translate: React.PropTypes.func.isRequired,
    };
    const Component = connectPut(options)(TestApp);
    const wrapper = shallow(<Component />);
    it('Should correctly display strings', () => {
      const html = wrapper.html();
      expect(html).to.have.string('你好, 欢迎username');
      expect(html).to.have.string('username has 3 apples');
      expect(html).to.have.string('a wild testKey');
    });
  });
});
