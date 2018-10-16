import './setupTests';
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';

describe('<App />', () => {
  const mockStore = configureStore();
  it('has no children when not loggined', () => {
    const store = mockStore({
    });
    const wrapper = shallow(<App store={store}/>).dive();
    expect(wrapper.type()).to.be.null;
  });
  it('has Router when logged in', () => {
    const store = mockStore({
      user: {},
    });
    const wrapper = shallow(<App store={store}/>).dive();
    expect(wrapper.find(Router)).to.have.lengthOf(1);
  });
});
