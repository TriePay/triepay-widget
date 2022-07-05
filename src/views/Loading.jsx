import React from 'react';
import Lottie from 'react-lottie'
import loadData from '../assets/loading.json'

const TransverseLoading = ({ height = 54, width = 54 }) => {
    return (
        <Lottie options={{
            loop: true,
            autoplay: true,
            animationData: loadData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        }}
                height={height}
                width={width}
        />
    );
};

export default TransverseLoading;
