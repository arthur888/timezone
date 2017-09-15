import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  //Link
} from 'react-router-dom'

/*
* Import pages here

You can define pages and their urls here and the particular js file will be included and shown

*/
import DetailPage from './pages/DetailPage';
import CitiesPage from './pages/CitiesPage';

class AppRouter extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={CitiesPage}/>
          <Route path="/timezone/:city/:lat/:lng/:tz*" component={DetailPage} />
        </div>
      </Router>
    );
  }
}

export default AppRouter

