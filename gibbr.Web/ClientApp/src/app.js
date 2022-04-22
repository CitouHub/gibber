import React, { useEffect, useState} from 'react';
import { Route } from 'react-router';
import Layout from './view/layout';
import BoardView from './view/board.view';

import * as Config from './util/config';
import * as AppSettingsService from './service/appsettings.service';

import './custom.css'

const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        AppSettingsService.get().then((result) => {
            Config.setApplicationSettings(result);
            if (!Config.getUser()) {
                Config.newUser();
            }
            setLoading(false);
        });
    }, []);

    if (loading === false) {
        return (
            <Layout>
                <Route exact path='/' component={BoardView} />
            </Layout>
        );
    } else {
        return (<p>Loading...</p>);
    }
}

export default App;
