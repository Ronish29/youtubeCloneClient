import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import './SubscriptionDetails.css'
import { Link } from 'react-router-dom';

const SubscriptionDetails = ({chanelId}) => {

    const [channel, setChannel] = useState(null);
    const CurrentUser = useSelector(state => state.currentUserReducer);

    useEffect(() => {
        fetch(`http://localhost:4000/chanel/chanelDetails/${chanelId}`,{
            headers: {
                'Authorization': `Bearer ${CurrentUser.token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setChannel(data);
            })
            .catch(error => console.error('Error fetching channel details:', error));
    }, [chanelId]);

    if (!channel) {
        return <div>Loading...</div>;
    }
    console.log(channel);

    return (
        <Link className='chanel_details' to={`/chanel/${chanelId}`}>
            <p>{channel.channelName.charAt(0).toUpperCase()}</p>
            <span>{channel.channelName}</span>
        </Link>
    );
}

export default SubscriptionDetails