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

        let user = Config.getUser();
        if (user) {
            document.title = `gibbr ${user.x} : ${user.y}`;
        } else {
            document.title = `gibbr 0 : 0`;
        }

        AppSettingsService.get().then((result) => {
            Config.setApplicationSettings(result);
            if (!Config.getUser()) {
                Config.newUser();
            }

            let route = window.location.href.split('/');
            let x = route[route.length - 2];
            let y = route[route.length - 1];
            if (x && y && /^\d+$/.test(x) && /^\d+$/.test(y)) {
                Config.setUserPosition(parseInt(x, 10), parseInt(y, 10));
            }

            setLoading(false);
        });
    }, []);

    if (loading === false) {
        return (
            <Layout>
                <Route path='/' component={BoardView} />
            </Layout>
        );
    } else {
        document.title = `Loading...`;
        return null;
    }
}

export default App;
