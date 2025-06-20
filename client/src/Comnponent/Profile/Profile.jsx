import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [avatarURL, setAvatarURL] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notifications-enabled') === 'true'
  );

  useEffect(() => {
    // Load saved avatar from localStorage
    const saved = localStorage.getItem('user-avatar');
    if (saved) {
      setAvatarURL(saved);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const localURL = URL.createObjectURL(file);
    setAvatarURL(localURL);
    localStorage.setItem('user-avatar', localURL);
  };

  const handleAPIAvatar = () => {
    // Generate random avatar from Dicebear API
    const seed = Math.random().toString(36).substring(7);
    const url = `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`;
    setAvatarURL(url);
    localStorage.setItem('user-avatar', url);
  };

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notifications-enabled', 'true');
        showNotification('Notifications enabled!', 'You will receive updates.');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notifications-enabled', 'false');
    }
  };

  // Helper to show notification
  const showNotification = (title, body) => {
    if (
      notificationsEnabled &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      new Notification(title, { body });
    }
  };

  // Example: Simulate answer/upvote notification (for demo)
  // In real app, call showNotification from your answer/upvote logic
  const simulateAnswer = () => {
    showNotification('Someone answered your question!', 'Check it out now.');
  };
  const simulateUpvote = () => {
    showNotification('Your question was upvoted!', 'Congrats!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile Picture</h2>
      <div style={{ margin: '10px 0' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleAPIAvatar} style={{ marginLeft: '10px' }}>
          Use Random Avatar
        </button>
      </div>
      {avatarURL && (
        <img
          src={avatarURL}
          alt="Avatar"
          width={150}
          height={150}
          style={{ borderRadius: '50%', border: '2px solid gray', marginTop: '20px' }}
        />
      )}

      <div style={{ marginTop: '30px' }}>
        <h3>Notifications</h3>
        <button onClick={handleNotificationToggle}>
          {notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
        </button>
        {/* Demo buttons, remove in production */}
        {notificationsEnabled && (
          <div style={{ marginTop: '10px' }}>
            <button onClick={simulateAnswer}>Simulate Answer Notification</button>
            <button onClick={simulateUpvote} style={{ marginLeft: '10px' }}>
              Simulate Upvote Notification
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;