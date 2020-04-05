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
            user: null,
            updating: false,
            last_updated: null
        };

        this.updateTimer = null;

        this.update = this.update.bind(this);
    }

    componentDidMount() {
        this.update();
        this.updateTimer = setInterval(() => this.update(), 30*60*1000);
    }

    componentWillUnmount() {
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }
    }

    update() {
        const self = this;
        const { id } = this.props;

        self.setState({
            updating: true
        });


        getUser(id).then((response) => { return response.json() }).then((user) => {
            self.setState({
                user,
                updating: false,
                last_updated: moment().format('YYYY-MM-DD HH:mm:ss')
            });            
        });

    }

    render() {
        const { user, updating, last_updated } = this.state;

        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <h5 className="text-uppercase">{user && <a href={`https://stats.foldingathome.org/donor/${user.name}`}>{user.name}</a>}</h5>
                        </div>
                        <div className="col-auto ml-auto">
                            <span onClick={() => { this.update() }}><i className={`fas fa-sync-alt ${updating === true ? '' : ''}`}></i></span>
                        </div>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <div className="row">
                                <div className="col text-muted">
                                    <span><i class="fas fa-wallet fa-lg pr-1"></i> {user && user.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                </div>
                                <div className="col text-muted">
                                    <span><i class="fas fa-hashtag fa-lg pr-1"></i> {user && user.rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div className="row">
                                <div className="col-auto text-muted d-flex flex-row">
                                    <span>
                                        <i class="fas fa-cogs fa-lg pr-2"></i>
                                    </span>
                                    <span>
                                        {user && user.wus.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <small>({user && moment.utc(user.last).local().format("YYYY-MM-DD HH:mm:ss Z")})</small>
                                    </span>
                                </div>
                                <div className="col-auto text-muted">
                                    <span><i class="fas fa-robot fa-lg pr-1"></i> {user && user.active_7}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div className="text-muted pt-3 text-right">
                        <small>Last Updated: {last_updated ? last_updated : 'Never'}</small>
                    </div>
                </div>
            </div>
        );
    }
};

export default UserOverview;