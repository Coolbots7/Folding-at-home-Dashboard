import React from 'react';
import './Client.css';
import PropTypes from 'prop-types';
import socketIOClient from "socket.io-client";
import { getClient, getClientSlots, pauseClient, unpauseClient, pauseClientSlot, unpauseClientSlot, finishClient, finishClientSlot } from '../../utils/fah-client';
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
            updating: false,
            last_updated: null
        };

        this.animateHeartbeatTimer = null;
        this.animateHeartbeat = this.animateHeartbeat.bind(this);
        this.update = this.update.bind(this);
        this.pause = this.pause.bind(this);
        this.unpause = this.unpause.bind(this);
        this.finish = this.finish.bind(this);
        this.pauseSlot = this.pauseSlot.bind(this);
        this.unpauseSlot = this.unpauseSlot.bind(this);
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
                    queue: queue.queue,
                    last_updated: new Date()
                });
            }
        });

        socket.on("slot-info", (slots) => {
            if (slots.id == id) {
                // console.log("slots", slots);
                self.setState({
                    slots: slots.data,
                    last_updated: new Date()
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
                    ppd: ppd.ppd,
                    last_updated: new Date()
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
                    client,
                    last_updated: new Date()
                });
            });

        getClientSlots(id)
            .then((res) => { return res.json() })
            .then((slots) => {
                // console.log('slots', slots);
                self.setState({
                    slots,
                    last_updated: new Date()
                });
            });

    }

    pause() {
        const { id } = this.props;
        pauseClient(id).then(() => {
            this.update();
        });
    }

    unpause() {
        const { id } = this.props;
        unpauseClient(id).then(() => {
            this.update();
        });
    }

    finish() {
        const { id } = this.props;
        finishClient(id).then(() => {
            this.update();
        });
    }

    pauseSlot(slot) {
        const { id } = this.props;
        pauseClientSlot(id, slot).then(() => {
            this.update();
        });
    }

    unpauseSlot(slot) {
        const { id } = this.props;
        unpauseClientSlot(id, slot).then(() => {
            this.update();
        });
    }

    finishSlot(slot) {
        const { id } = this.props;
        finishClientSlot(id, slot).then(() => {
            this.update();
        });
    }

    render() {
        const { client, slots, queue, heartbeat, ppd, updating, last_updated } = this.state;

        return (
            <div className="card h-100">
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col d-flex flex-column">
                            <div className="d-flex flex-row">
                                <h5 className="text-uppercase mb-0">{client && <a href={`http://${client.host}:7396`}>{client.name}</a>} <span className={`heartbeat ${heartbeat && 'heartbeat-show'}`}><i className={`fas fa-heartbeat`}></i></span></h5>

                                <div className="ml-auto text-white">
                                    <span onClick={() => this.unpause()}><i class="fas fa-lg fa-play-circle mr-2"></i></span>
                                    <span onClick={() => this.pause()}><i class="fas fa-lg fa-pause-circle mr-2"></i></span>
                                    <span onClick={() => { this.finish() }}><i class="fas fa-lg fa-chevron-circle-right mr-2"></i></span>
                                    <span onClick={() => { this.update() }}><i className={`fas fa-lg fa-sync-alt ${updating === true ? '' : ''}`}></i></span>
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
                                    // progress_background = 'bg-warning';
                                    // progress_width = '100%';
                                    // progress_text = <span className="text-center text-uppercase">PAUSED ({slot.reason})</span>;
                                    break;
                                case 'FINISHING':
                                    break;
                            }

                            return (
                                <li key={slot.id} class="list-group-item">
                                    <div className="row">
                                        <div className="pl-0 col-auto d-flex flex-column text-center">
                                            <strong>{slot.id}</strong>
                                            <span style={{ fontSize: '0.8rem' }} className="text-white text-uppercase">{slot.description.match(/(cpu:\d+|gpu:\d+)/)[0]}</span>
                                            <span style={{ fontSize: '0.8rem' }} className="text-muted text-uppercase">{slot.status} {slot.reason && <>({slot.reason})</>}</span>
                                            <span style={{ fontSize: '0.8rem' }} className="text-muted text-uppercase"><i class="fas fa-coins"></i>/DAY {slot_queues && slot_queues[0].ppd.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                            <div className="text-white">
                                                <span onClick={() => { this.unpauseSlot(slot.id) }}><i class="fas fa-play-circle mr-2"></i></span>
                                                <span onClick={() => { this.pauseSlot(slot.id) }}><i class="fas fa-pause-circle mr-2"></i></span>
                                                <span onClick={() => {this.finishSlot(slot.id)}}><i class="fas fa-chevron-circle-right"></i></span>
                                            </div>

                                            {/* <div className="d-flex flex-row justify-content-around">
                                        <span><strong>Idle: </strong>{slot.idle.toString()}</span>
                                    </div> */}
                                        </div>
                                        <div className="col pr-0 d-flex flex-column">

                                            {slot_queues && slot_queues.map((q) => {
                                                switch (q.state) {
                                                    case "DOWNLOAD":
                                                        progress_background = 'bg-info';
                                                        progress_width = '100%'
                                                        progress_text = <span className="text-center">{q.nextattempt} ({q.attempts})</span>
                                                        break;
                                                    case "READY":
                                                        progress_background = 'bg-primary';
                                                        progress_width = '100%';
                                                        progress_text = <span className="text-center">READY ({q.percentdone})</span>
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
                    <div className="text-muted pt-3 text-right">
                        <small>Last Updated: {last_updated ? moment(last_updated).format("YYYY-MM-DD HH:mm:ss"): 'Never'}</small>
                    </div>
                </div>
            </div>
        )
    }
};

export default Client;