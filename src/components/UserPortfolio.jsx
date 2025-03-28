import React from 'react';

const UserPortfolio = ({ userData }) => {
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-portfolio">
      <h2>{userData.name}'s Portfolio</h2>
      <p>Email: {userData.email}</p>
      <p>Bio: {userData.bio}</p>
      {/* Add more user-specific information as needed */}
    </div>
  );
};

export default UserPortfolio;