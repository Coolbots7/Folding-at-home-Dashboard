import React from 'react';
import PropTypes from 'prop-types';

const ValueCard = (props) => (
    <div className="card">
        <div className="card-body">
            <div className="row">
                <div className="col">
                    <h5 className="text-uppercase">{props.label}</h5>
                </div>
            </div>
            <div className="text-center">
                <h3>{props.value}</h3>
            </div>
        </div>
    </div>
);

ValueCard.propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.object.isRequired
}

export default ValueCard;