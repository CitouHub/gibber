import React from 'react';
import { Route } from 'react-router';
import Layout from './components/layout';
import Home from './components/home';

import './custom.css'

const App = () => {
    return (
        <Layout>
            <Route exact path='/' component={Home} />
        </Layout>
    );
}

export default App;
