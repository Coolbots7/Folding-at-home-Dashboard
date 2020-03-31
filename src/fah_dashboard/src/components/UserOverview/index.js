import React from 'react';
import PropTypes from 'prop-types';
import { getUser } from '../../utils/fah-client';
import moment from 'moment';

class UserOverview extends React.Component {
    static propTypes = {
        id: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            user: null
        };
    }

    componentDidMount() {
        const self = this;
        const { id } = this.props;

        getUser(id).then((response) => { return response.json() }).then((user) => {
            self.setState({
                user
            });
        })
    }

    render() {
        const { user } = this.state;

        return (
            <div className="card">
                <div className="card-header">
                    <h4>User</h4>
                </div>
                <div className="card-body">
                    <div className="row text-muted">
                        <div className="col-auto d-flex flex-column">
                            <strong>User: </strong>
                            <strong>Score: </strong>
                            <strong>WUs: </strong>
                            <strong>Clients: </strong>
                            <strong>Last WU: </strong>
                        </div>
                        {user &&
                            <div className="col pl-0">
                                <div>{user.name}</div>
                                <div>{user.score}</div>
                                <div>{user.wus}</div>
                                <div>{user.active_7}</div>
                                <div>{moment.utc(user.last).local().format("YYYY-MM-DD HH:mm:ss Z")}</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
};

export default UserOverview;