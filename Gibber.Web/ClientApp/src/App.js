import React, { useEffect, useState} from 'react';
import { Route } from 'react-router';
import Layout from './view/layout';
import Home from './view/home';

import * as Config from './util/config';
import * as AppSettingsService from './service/appsettings.service';

import './custom.css'

const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        AppSettingsService.get().then((result) => {
            Config.setApplicationSettings(result);
            setLoading(false);
        });
    }, []);

    if (!loading) {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
            </Layout>
        );
    } else {
        return (<p>Loading...</p>);
    }
}

export default App;
