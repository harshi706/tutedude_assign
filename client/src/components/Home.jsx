import React, { useEffect, useState } from "react";
import SignOut from "./SignOut";
import axios from "axios";
import Requests from "./Requests";
import Modal from "./Modal";
import Mutuals from "./Mutuals";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequestsSent, setFriendRequestsSent] = useState({});
  const[searchTerm,setSearchTerm]=useState("");

  // Fetch users and friends
  const showUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/auth/homie", {
        withCredentials: true, // Critical to send cookies
      });

      setUsers(response.data.users);
      setFriends(response.data.friends);

      // Initialize friendRequestsSent state for each user
      const requestsSent = {};
      response.data.friends.forEach((friend) => {
        requestsSent[friend._id] = true;
      });
      setFriendRequestsSent(requestsSent);
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

  // Handle Add Friend
  const handleAddFriend = async (friendId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/add",
        { friendId },
        {
          withCredentials: true,
        }
      );

      console.log(response.data.message);

      // Update friendRequestsSent state
      setFriendRequestsSent((prevState) => ({
        ...prevState,
        [friendId]: true,
      }));
    } catch (error) {
      console.error(
        "Error adding friend:",
        error.response?.data || error.message
      );
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/remove",
        { friendId },
        { withCredentials: true }
      );

      console.log(response.data.message);

      // Update the state to remove the friend from the list
      setFriends((prevState) =>
        prevState.filter((friend) => friend._id !== friendId)
      );

      // Optionally, if needed, update the "friendRequestsSent" state as well
      setFriendRequestsSent((prevState) => {
        const updatedState = { ...prevState };
        delete updatedState[friendId]; // Remove the friend from the requestSent state
        return updatedState;
      });
    } catch (error) {
      console.error(
        "Error removing friend:",
        error.response?.data || error.message
      );
    }
  };
  
  const handleChange=(e)=>{
    setSearchTerm(e.target.value);
  }
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredUsers)

  return (
    <div className="h-screen flex flex-col bg-gray-100 p-6">
    <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Let's Connect</h1>
    <div className="flex flex-wrap items-center gap-4">
      <Modal buttonText="Incoming Requests" comp={<Requests />} />
      <Modal buttonText="Mutuals" comp={<Mutuals />} />
      <SignOut />
    </div>
  </div>

  {/* Search Query */}
  <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
    <input
      type="text"
      value={searchTerm}
      onChange={handleChange}
      placeholder="Search..."
      className="w-full sm:w-1/2 p-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button
      onClick={() => {}}
      className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      Search
    </button>
  </div>
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Users & Friends
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Users List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Users</h2>
          <ul className="space-y-2">
          {filteredUsers.map((user) => (
              <li
                key={user._id}
                className="p-3 bg-gray-50 rounded-md shadow-sm border flex justify-between items-center hover:bg-blue-100 transition"
              >
                <span className="text-gray-800">{user.username}</span>
                {friendRequestsSent[user._id] ? (
                  <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    Request Sent
                  </span>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-all"
                    onClick={() => handleAddFriend(user._id)}
                  >
                    Add
                  </button>
                )}
              </li>
            ))}
            {/* {users.map((user) => (
              <li
                key={user._id}
                className="p-3 bg-gray-50 rounded-md shadow-sm border flex justify-between items-center hover:bg-blue-100 transition"
              >
                <span className="text-gray-800">{user.username}</span>
                {friendRequestsSent[user._id] ? (
                  <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    Request Sent
                  </span>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-all"
                    onClick={() => handleAddFriend(user._id)}
                  >
                    Add
                  </button>
                )}
              </li>
            ))} */}
          </ul>
        </div>

        {/* Friends List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Friends</h2>
          {friends.length > 0 ? (
            <ul className="space-y-2">
              {friends.map((friend) => (
                <li
                  key={friend._id} // <-- Here's where the friendId comes from
                  className="p-3 bg-gray-50 rounded-md shadow-sm border hover:bg-blue-100 transition flex justify-between items-center"
                >
                  <span className="text-gray-800">{friend.username}</span>{" "}
                  {/* Friend's name */}
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 transition"
                    onClick={() => handleRemoveFriend(friend._id)} // <-- Passing friendId (user._id)
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No friends added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
