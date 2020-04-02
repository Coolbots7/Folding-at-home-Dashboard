import React from 'react';
import UserOverview from '../../components/UserOverview';
import Client from '../../components/Client';
import { getClients } from '../../utils/fah-client';
import socketIOClient from "socket.io-client";

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
        })
    }

    render() {
        const { clients, ppd } = this.state;

        return (
            <div className="container my-4">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <UserOverview id={78476448} />
                    </div>
                </div>

                <hr />
                <h3><i class="fas fa-coins"></i>/DAY {ppd && ppd.replace(/\.?\d*$/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
                <div className="row mt-3">
                    {clients && clients.map((client) => (

                        <div className="col-12 col-md-4 pb-4">
                            <Client key={client.id} id={client.id} />
                        </div>
                    ))}
                </div>

            </div>
        );
    }
};

export default Home;