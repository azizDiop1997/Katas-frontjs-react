import React, { Component } from 'react';
import Calendar from '../components/Calendar';
import data from '../json/input.json';
import '../css/App.css';

class Home extends Component {
    render() {
        return (
            <div className="home">
                <Calendar Data={data}></Calendar>
            </div>
        );
    }
}

export default Home;