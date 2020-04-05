import React from 'react';
import UserOverview from '../../components/UserOverview';
import Client from '../../components/Client';
import { getClients } from '../../utils/fah-client';
import socketIOClient from "socket.io-client";
import TeamOverview from '../../components/TeamOverview';
import ValueCard from '../../components/ValueCard';
import GlobalControls from '../../components/GlobalControls';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clients: null,
            ppd: 0
        };
    }

    componentDidMount() {
        const self = this;

        getClients()
            .then((res) => { return res.json() })
            .then((clients) => {
                self.setState({
                    clients
                });
            });


        const socket = socketIOClient("http://192.168.2.155:3001");
        socket.on('ppd', (ppd) => {
            if (ppd.id == -1) {
                self.setState({
                    ppd: ppd.ppd.toString()
                });
            }
        });
    }

    render() {
        const { clients, ppd } = this.state;

        return (
            <div className="container-fluid px-3 my-4">
                <div className="row">
                    <div className="col-lg-4 col-12 border-right border-white">
                        <UserOverview id={78476448} />
                        <div className="mt-3">
                            <TeamOverview id={201140} user_id={78476448} />
                        </div>
                    </div>
                    <div className="col">
                        <div className="row d-flex justify-content-around">
                            <div className="col-4">
                                <ValueCard value={ppd && <>{ppd.replace(/\.?\d*$/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>} label={<><i class="fas fa-coins"></i> / DAY</>} />
                            </div>
                            <div className="col-4">
                                <ValueCard value={<span>6/7</span>} label={<><i class="fas fa-cogs"></i> / SLOTS</>} />
                            </div>
                            <div className="col">
                                <GlobalControls />
                            </div>
                        </div>
                        <div className="row mt-4">
                            {clients && clients.map((client) => (
                                <div className="col-12 col-md-6 pb-4">
                                    <Client key={client.id} id={client.id} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Home;