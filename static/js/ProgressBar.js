import React from 'react';

const ProgressBar = ({targetProgressbar}) => {

    return (
        <div className='w-full'>
            <div className="mb-2 mt-1 w-full">
                <div className="progress progress-infinite">
                    <div className="progress-bar3" style={{ width: `${targetProgressbar}%` }}></div> 
                </div>
            </div>
        </div>
    );
}

export default ProgressBar;
