import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Mutuals = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('https://tutedude-assign.onrender.com/auth/recommendations', {
        withCredentials: true, 
      });
      setRecommendations(response.data.recommendations);
      setLoading(false);
    } catch (err) {
      setError("Error fetching recommendations");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Friend Recommendations</h2>

      {loading ? (
        <p className="text-gray-500">Loading recommendations...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : recommendations.length > 0 ? (
        <ul className="space-y-2">
          {recommendations.map((recommendation) => (
            <li
              key={recommendation._id}
              className="p-3 bg-gray-50 rounded-md shadow-sm border hover:bg-blue-100 transition flex justify-between items-center"
            >
              <span className="text-gray-800">{recommendation.username}</span>
              <span className="text-gray-500 text-sm">
                {recommendation.mutualConnections} mutual connection(s)
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No recommendations available.</p>
      )}
    </div>
  );
};

export default Mutuals;
