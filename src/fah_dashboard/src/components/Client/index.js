import React from 'react';
import './Client.css';
import PropTypes from 'prop-types';
import socketIOClient from "socket.io-client";
import { getClient, getClientSlots } from '../../utils/fah-client';
import moment from 'moment';

class Client extends React.Component {
    static propTypes = {
        id: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            client: null,
            slots: null,
            queue: null,
            ppd: null,
            updating: false
        };

        this.animateHeartbeatTimer = null;
        this.animateHeartbeat = this.animateHeartbeat.bind(this);
        this.update = this.update.bind(this);
    }

    animateHeartbeat() {
        if (this.animateHeartbeatTimer) {
            clearTimeout(this.animateHeartbeatTimer);
        }
        this.setState({
            heartbeat: true
        });

        this.animateHeartbeatTimer = setTimeout(() => {
            this.setState({
                heartbeat: false
            });
        }, 15000);
    }

    componentDidMount() {
        const self = this;
        const { id } = this.props;

        this.update();

        const socket = socketIOClient("http://192.168.2.155:3001");
        socket.on("queue-info", (queue) => {
            if (queue.id == id) {
                // console.log("queue", queue);
                self.setState({
                    queue: queue.queue
                });
            }
        });

        socket.on("slot-info", (slots) => {
            if (slots.id == id) {
                // console.log("slots", slots);
                self.setState({
                    slots: slots.data
                });
            }
        });

        socket.on("heartbeat", (heartbeat) => {
            if (heartbeat.id == id) {
                self.animateHeartbeat();
            }
        });

        socket.on('ppd', (ppd) => {
            if (ppd.id == id) {
                self.setState({
                    ppd: ppd.ppd
                });
            }
        });
    }

    update() {
        const self = this;
        const { id } = this.props;

        getClient(id)
            .then((res) => { return res.json(); })
            .then((client) => {
                self.setState({
                    client
                });
            });

        getClientSlots(id)
            .then((res) => { return res.json() })
            .then((slots) => {
                self.setState({
                    slots
                });
            });

    }

    render() {
        const { client, slots, queue, heartbeat, ppd, updating } = this.state;

        return (
            <div className="card h-100">
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col d-flex flex-column">
                            <div className="d-flex flex-row">
                                <h5 className="text-uppercase mb-0">{client && <a href={`http://${client.host}:7396`}>{client.name}</a>} <span className={`heartbeat ${heartbeat && 'heartbeat-show'}`}><i className={`fas fa-heartbeat`}></i></span></h5>

                                <div className="ml-auto text-white">
                                    <span onClick={() => { this.update() }}><i className={`fas fa-sync-alt ${updating === true ? '' : ''}`}></i></span>
                                </div>
                            </div>
                            <span className="text-muted" style={{ fontSize: '0.9rem' }}>{client && <>{client.host}:{client.port}</>}</span>
                            <span className="text-muted" style={{ fontSize: '0.9rem' }}><i class="fas fa-coins"></i>/DAY {ppd ? ppd.replace(/\.?\d*$/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0'}</span>
                        </div>


                        {/* <div className="col-auto d-flex flex-column">
                            <strong>User</strong>
                            <strong>Team</strong>
                            <strong>Passkey</strong>
                        </div>
                        <div className="col pl-0">

                        </div>

                        <div className="col-auto d-flex flex-column">
                            <strong>Power</strong>
                            <strong>When</strong>
                            <strong>Cause</strong>
                            <strong>Version</strong>
                            <strong>Est. Points per Day</strong>
                        </div>
                        <div className="col pl-0">

                        </div> */}
                    </div>

                    <ul class="list-group list-group-flush">
                        {slots && slots.map((slot) => {

                            var slot_queues = null;
                            if (queue) {
                                slot_queues = queue.filter(q => q.slot == slot.id).sort(q => q.state[0] == 'RUNNING' ? 0 : 1)
                            }

                            var progress_background = 'bg-info progress-bar-striped progress-bar-animated';
                            var progress_width = '100%';
                            var progress_text = '';

                            switch (slot.status) {
                                case 'READY':
                                    break;
                                case 'RUNNING':
                                    break;
                                case 'PAUSED':
                                    progress_background = 'bg-warning';
                                    progress_width = '100%';
                                    progress_text = <span className="text-center text-uppercase">PAUSED ({slot.reason})</span>;
                                    break;
                            }

                            return (
                                <li key={slot.id} class="list-group-item">
                                    <div className="row">
                                        <div className="col-auto d-flex flex-column text-center">
                                            <strong>{slot.id}</strong>
                                            <span style={{ fontSize: '0.8rem' }} className="text-muted text-uppercase">{slot.description.substring(0, 6)}</span>
                                            <span style={{ fontSize: '0.8rem' }} className="text-muted text-uppercase"><i class="fas fa-coins"></i>/DAY {slot_queues && slot_queues[0].ppd.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>

                                            {/* <div className="d-flex flex-row justify-content-around">
                                        <span><strong>Idle: </strong>{slot.idle.toString()}</span>
                                    </div> */}
                                        </div>
                                        <div className="col d-flex flex-column">

                                            {slot_queues && slot_queues.map((q) => {
                                                if (slot.status !== 'PAUSED') {
                                                    switch (q.state) {
                                                        case "DOWNLOAD":
                                                            progress_background = 'bg-info';
                                                            progress_width = '100%'
                                                            progress_text = <span className="text-center">{q.nextattempt} ({q.attempts})</span>
                                                            break;
                                                        case "READY":
                                                            progress_background = 'bg-primary';
                                                            progress_width = '100%'
                                                            progress_text = <span className="text-center">READY</span>
                                                            break;
                                                        case "RUNNING":
                                                            progress_background = 'bg-success progress-bar-striped progress-bar-animated';
                                                            progress_width = q.percentdone;
                                                            progress_text = <span className="w-100 text-center">{q.percentdone}</span>;
                                                            break;
                                                        case 'SEND':
                                                            progress_background = 'bg-primary progress-bar-striped progress-bar-animated';
                                                            progress_text = <span className="text-center">SENDING</span>
                                                            break;
                                                    }
                                                }

                                                return (
                                                    <div key={queue.id} className="d-flex flex-column pb-3">
                                                        <div className="progress">
                                                            <div className={`progress-bar ${progress_background}`} role="progressbar" style={{ width: `${progress_width}` }} aria-valuenow={progress_width} aria-valuemin="0" aria-valuemax="100">{progress_text}</div>
                                                        </div>

                                                        {q.state === "RUNNING" &&
                                                            <div className="d-flex flex-column text-muted" style={{ fontSize: '0.8rem' }}>
                                                                <span>PRCG: <a href={`https://apps.foldingathome.org/project?p=${q.project}`}>{q.project}</a>({q.run}, {q.clone}, {q.gen})</span>
                                                                {/* <span><i class="fas fa-stopwatch"></i> {q.eta} ({moment.utc(q.assigned).local().format('HH:mm:ss')})</span> */}
                                                                <span><i class="fas fa-stopwatch"></i> {q.eta}</span>
                                                                <span><i class="fas fa-coins"></i> {q.creditestimate} [{q.basecredit}]</span>
                                                            </div>
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>


                </div>
            </div>
        )
    }
};

export default Client;