import React from 'react';
import PropTypes from 'prop-types';
import { getTeam, getTeamMembers, getUserTeams } from '../../utils/fah-client';
import moment from 'moment';

class TeamOverview extends React.Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        user_id: PropTypes.number
    };

    static defaultProps = {
        user_id: null
    };

    constructor(props) {
        super(props);

        this.state = {
            team: null,
            members: null,
            user_teams: null,
            updating: false,
            last_updated: null
        };

        this.updateTimer = null;

        this.update = this.update.bind(this);
    }

    componentDidMount() {
        this.update();
        this.updateTimer = setInterval(() => this.update(), 30 * 60 * 1000);
    }

    componentWillUnmount() {
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }
    }

    update() {
        const self = this;
        const { id, user_id } = this.props;

        getTeam(id)
            .then((res) => { return res.json() })
            .then((team) => {
                self.setState({
                    team,
                    last_updated: moment().format('YYYY-MM-DD HH:mm:ss')
                });
            });

        getTeamMembers(id)
            .then((res) => { return res.json() })
            .then((members) => {
                self.setState({
                    members
                });
            });

        if (user_id) {
            getUserTeams(user_id).then((res) => { return res.json() })
                .then((user_teams) => {
                    self.setState({
                        user_teams
                    });
                });
        }
    }

    render() {
        const { id, user_id } = this.props;
        const { team, members, user_teams, updating, last_updated } = this.state;

        var user = null;
        var user_rank = 0;
        var user_team = null;
        if (members && user_id && user_teams) {
            user = members.find(m => m[1] == user_id);

            for (var i = 1; i < members.length; i++) {
                if (members[i][1] == user_id) {
                    user_rank = i;
                    break;
                }
            }

            for (var i = 0; i < user_teams.length; i++) {
                if (user_teams[i].team == id) {
                    user_team = user_teams[i];
                    break;
                }
            }
        }

        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <h5 className="text-uppercase"><a href={`https://stats.foldingathome.org/team/${id}`}>{team && team.name}</a></h5>
                        </div>
                        <div className="col-auto ml-auto">
                            <span onClick={() => { this.update() }}><i className={`fas fa-sync-alt ${updating === true ? '' : ''}`}></i></span>
                        </div>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <div className="row">
                                <div className="col-auto text-muted">
                                    <span><i class="fas fa-wallet fa-lg pr-1"></i> {team && team.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                </div>
                                <div className="col-auto text-muted">
                                    <span><i class="fas fa-hashtag fa-lg pr-1"></i> {team && team.rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div className="row d-flex">
                                <div className="col-auto text-muted d-flex flex-row">
                                    <span>
                                        <i class="fas fa-cogs fa-lg pr-2"></i>
                                    </span>
                                    <span>
                                        {team && team.wus.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <small>({team && moment.utc(team.last).local().format("YYYY-MM-DD HH:mm:ss Z")})</small>
                                    </span>
                                </div>
                                <div className="col-auto text-muted">
                                    <span><i class="fas fa-robot fa-lg pr-1"></i> {team && team.active_50}</span>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="row">
                                <div className="col-auto text-muted">
                                    <span><i class="fas fa-users"></i> {team && team.members.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                </div>
                            </div>
                        </li>
                        {user_id &&
                            <>
                                <hr />
                                <h5><a href="#">ME</a></h5>
                                <li className="list-group-item">
                                    <div className="row justify-content-between">
                                        <div className="col-auto text-muted">
                                            <span><i class="fas fa-wallet fa-lg pr-1"></i> {user_team && user_team.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                        </div>
                                        <div className="col-auto text-muted">
                                            <span><i class="fas fa-hashtag fa-lg pr-1"></i> {user_rank}</span>
                                        </div>
                                        <div className="text-muted">
                                            <span>
                                                <i class="fas fa-cogs fa-lg pr-2"></i>
                                            </span>
                                            <span>
                                                {user_team && user_team.wus.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <small>({user_team && moment.utc(user_team.last).local().format("YYYY-MM-DD HH:mm:ss Z")})</small>
                                            </span>
                                        </div>
                                        <div className="col-auto text-muted">
                                            <span><i class="fas fa-robot fa-lg pr-1"></i> {user_team && user_team.active_7}</span>
                                        </div>
                                    </div>
                                </li>
                            </>
                        }
                    </ul>
                    <div className="text-muted pt-3 text-right">
                        <small>Last Updated: {last_updated ? last_updated : 'Never'}</small>
                    </div>
                </div>
            </div>
        );
    }
};

export default TeamOverview;