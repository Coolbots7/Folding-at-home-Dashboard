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
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <h5 className="text-uppercase">{user && <a href={`https://stats.foldingathome.org/donor/${user.name}`}>{user.name}</a>}</h5>
                        </div>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <div className="row">
                                <div className="col-auto text-muted">
                                    <span><i class="fas fa-wallet"></i> {user && user.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                </div>
                                <div className="col-auto text-muted">
                                    <span><i class="fas fa-hashtag"></i> {user && user.rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div className="row">
                                <div className="col-auto text-muted d-flex flex-row">
                                    <span>
                                        <i class="fas fa-upload"></i>
                                    </span>
                                    <span className="pl-2">
                                        {user && user.wus.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <small>({user && moment.utc(user.last).local().format("YYYY-MM-DD HH:mm:ss Z")})</small>
                                    </ span>
                                </div>
                                <div className="col-auto text-muted">
                                    <span><i class="fas fa-robot"></i> {user && user.active_7}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
};

export default UserOverview;