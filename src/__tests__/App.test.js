import { render, screen } from '@testing-library/react';
import App from '../App.js';
import React from 'react';
import {NavLink} from "react-bootstrap";
import {BrowserRouter} from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';

test('it renders', () => {
  //render(<App />);
  render(<App />, {wrapper: BrowserRouter})

  //const linkElement = screen.getByText(/learn react/i);
  //expect(linkElement).toBeInTheDocument();
  const myNavLinkElement = screen.getByText('Painting Music');
  expect(myNavLinkElement).toBeInTheDocument();

});
