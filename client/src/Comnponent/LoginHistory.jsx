import React, { useEffect, useState } from 'react';
import { getLoginHistory } from '../api';

const LoginHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (userId) {
      getLoginHistory(userId).then(res => setHistory(res.data));
    }
  }, [userId]);

  return (
    <div>
      <h3>Login History</h3>
      <ul>
        {history.map((item, idx) => (
          <li key={idx}>
            {new Date(item.timestamp).toLocaleString()} - {item.browser} - {item.os} - {item.device} - {item.ip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoginHistory;