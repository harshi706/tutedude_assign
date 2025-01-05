import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Requests = () => {
    const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  // Fetch friend requests
  const getFriendRequests = async () => {
    try {
      const response = await axios.get('https://tutedude-assign.onrender.com/auth/getrequest', {
        withCredentials: true, // Send cookies if needed
      });
      setFriendRequests(response.data.friendRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getFriendRequests();
  }, []);

  const showUsers = async () => {
    try {
      const response = await axios.get("https://tutedude-assign.onrender.com/auth/homie", {
        withCredentials: true, // Critical to send cookies
      });

      setFriends(response.data.friends);

      // Initialize friendRequestsSent state for each user
      const requestsSent = {};
      response.data.friends.forEach((friend) => {
        requestsSent[friend._id] = true;
      });
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    showUsers();
  }, []);

  // Handle accepting a friend request
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await axios.post(
        'https://tutedude-assign.onrender.com/auth/accept',
        { friendId: requestId },
        { withCredentials: true }
      );
  
      console.log(response.data.message);
  
      // Update the friendRequests state by removing the accepted request
      setFriendRequests(prevRequests =>
        prevRequests.filter(request => request._id !== requestId)
      );
  
      // Add the accepted friend to the friends list
      setFriends(prevFriends => [...prevFriends, response.data.newFriend]);
    } catch (error) {
      console.error("Error accepting request:", error.response?.data || error.message);
    }
  };
  
  // useEffect(()=>{
  //    handleAcceptRequest();
  // },[])

  // Handle rejecting a friend request
  const handleRejectRequest = async (requestId) => {
    try {
      const response = await axios.post('https://tutedude-assign.onrender.com/auth/decline', 
        { friendId: requestId }, 
        { withCredentials: true }
      );
      console.log(response.data.message);
      
      // Update the friendRequests state by removing the rejected request
      setFriendRequests(prevRequests => 
        prevRequests.filter(request => request._id !== requestId)
      );
    } catch (error) {
      console.error("Error rejecting request:", error.response?.data || error.message);
    }
  };

  return (
    <div className="modal-content bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Friend Requests</h2>
      {friendRequests.length > 0 ? (
        <ul className="space-y-2">
          {friendRequests.map((request) => (
            <li
              key={request._id}
              className="p-3 bg-gray-50 rounded-md shadow-sm border hover:bg-blue-100 transition flex justify-between items-center"
            >
              <span className="text-gray-800 pr-8">{request.username}</span>
              <div className="flex gap-3">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 transition"
                  onClick={() => handleAcceptRequest(request._id)} // Accept Request
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600 transition"
                  onClick={() => handleRejectRequest(request._id)} // Reject Request
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No friend requests received.</p>
      )}
    </div>
  );
};

export default Requests;
