import React from 'react';
import moment from 'moment';

const Footer = () => {
    return (
        <div className="container mb-4">
            <footer class="pt-4 my-md-5 pt-md-5 border-top">
                <div class="row">
                    <div class="col-12 col-md">
                        <small class="d-block mb-3 text-muted">&copy; {moment().format('YYYY')}</small>
                    </div>
                    <div class="col-6 col-md">
                        <h5>Folding@Home</h5>
                        <ul class="list-unstyled text-small">
                            <li><a class="text-muted" href="https://foldingathome.org/">Folding@Home</a></li>
                            <li><a class="text-muted" href="https://twitter.com/foldingathome">Twitter</a></li>
                            <li><a class="text-muted" href="https://apps.foldingathome.org/serverstats">Server Status</a></li>
                            <li><a class="text-muted" href="https://stats.foldingathome.org/donors">Donor Stats</a></li>
                            <li><a class="text-muted" href="https://stats.foldingathome.org/teams">Team Stats</a></li>
                            <li><a class="text-muted" href="https://stats.foldingathome.org/os">Client Stats</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;