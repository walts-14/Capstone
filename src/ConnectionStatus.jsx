import React, { useEffect, useState } from 'react';

const ConnectionStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const updateStatus = () => setIsOnline(navigator.onLine);

        window.addEventListener("online", updateStatus);
        window.addEventListener("offline", updateStatus);

        return () => {
            window.removeEventListener("online", updateStatus);
            window.removeEventListener("offline", updateStatus);
        };
    }, []);

    return (
        <div style={{ 
            backgroundColor: isOnline ? '#d4edda' : '#f8d7da', 
            color: isOnline ? '#155724' : '#721c24', 
            padding: '10px', 
            textAlign: 'center'
        }}>
            {isOnline ? '🟢 Online Mode' : '🔴 Offline Mode'}
        </div>
    );
};

export default ConnectionStatus;
