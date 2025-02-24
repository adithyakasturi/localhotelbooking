import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});

    useEffect(() => {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");

        if (!userId || !token) {
            setError("User ID or Token not found. Please log in.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch user details
                const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userResponse.data);
                setEditedUser(userResponse.data);

                // Fetch user bookings
                const bookingsResponse = await axios.get(`http://localhost:5000/api/bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(bookingsResponse.data);
            } catch (err) {
                console.error("Error:", err);
                setError(err.response?.data?.message || "Authorization failed. Please log in again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setEditedUser(user);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        setEditedUser({
            ...editedUser,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        

        try {
            const response = await axios.put(`http://localhost:5000/api/users/${userId}`, editedUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update Error:", err);
            alert("Error updating profile: " + err.response?.data?.message || err.message);
        }
    };

    if (loading) return <p className="text-center">Loading user data...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">User Profile</h2>
            <div className="border p-4 rounded-lg shadow flex items-center gap-4">
                <img src={user.profilePic} alt="Profile" className="w-20 h-20 rounded-full border" />

                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            name="name"
                            value={editedUser.name}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1"
                        />
                        <input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1"
                        />
                        <input
                            type="text"
                            name="phone"
                            value={editedUser.phone}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1"
                        />
                        <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                        <button onClick={handleCancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                    </div>
                ) : (
                    <div className="text-left">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <button onClick={handleEditClick} className="bg-blue-500 text-white px-3 py-1 mt-2 rounded">Edit Profile</button>
                    </div>
                )}
            </div>

            <h2 className="text-2xl font-bold my-6">Previous Room Bookings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg shadow p-4">
                            <img
                                src={booking.image}
                                alt={booking.hotelName}
                                className="w-full h-32 object-cover rounded"
                            />
                            <p><strong>{booking.hotelName}</strong></p>
                            <p>{booking.roomType}</p>
                            <p>{new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()}</p>
                            <p className="text-green-600 font-bold">₹{booking.price}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No bookings found.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
