import React from 'react';

const Layout = (props) => {
    return (
        <div className='full-size'>
            {props.children}
        </div>
    );
}

export default Layout;
