import React from 'react';
import UserOverview from '../../components/UserOverview';

const Home = () => (
    <div className="container my-4">
        <div className="row">
            <div className="col-6">
                <UserOverview id={78476448} />
            </div>
        </div>
    </div>
);

export default Home;