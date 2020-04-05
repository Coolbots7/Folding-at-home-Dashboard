import React from 'react';
import { pauseAllClients, unpauseAllClients, finishAllClients } from '../../utils/fah-client';

class GlobalControls extends React.Component {

    constructor(props) {
        super(props);

        this.pause = this.pause.bind(this);
        this.unpause = this.unpause.bind(this);
        this.finish = this.finish.bind(this);
    }

    pause() {
        pauseAllClients().then(() => {

        });
    }

    unpause() {
        unpauseAllClients().then(() => {

        });
    }

    finish() {
        finishAllClients().then(() => {

        });
    }

    render() {
        return (
            <div className="card h-100">
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <h5 className="text-uppercase">Controls</h5>
                        </div>
                    </div>
                    <div className="row h-100">
                        <div className="col d-flex flex-row justify-content-center text-white">
                            <span onClick={() => { this.unpause() }}><i class="fas fa-2x fa-play-circle mr-2"></i></span>
                            <span onClick={() => { this.pause() }}><i class="fas fa-2x fa-pause-circle mr-2"></i></span>
                            <span onClick={() => { this.finish() }}><i class="fas fa-2x fa-chevron-circle-right"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GlobalControls;