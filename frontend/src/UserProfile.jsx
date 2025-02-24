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

        // Fetch user details with the token
        axios.get(`http://localhost:5000/api/users/${userId}`)
            .then((response) => {
                setUser(response.data);
                setEditedUser(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });

        // Fetch user bookings with the token
        axios.get(`http://localhost:5000/api/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setBookings(response.data);
            })
            .catch((err) => {
                console.error("Error fetching bookings:", err);
                setError(err.message);
            });
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

    const handleSave = () => {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");

        axios.put(`http://localhost:5000/api/users/${userId}`, editedUser, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setUser(response.data);
                setIsEditing(false);
                alert("Profile updated successfully!");
            })
            .catch((err) => {
                alert("Error updating profile: " + err.message);
            });
    };

    if (loading) return <p>Loading user data...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-6">
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
                            type="text"
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
                            <p>{booking.checkIn} to {booking.checkOut}</p>
                            <p>{booking.price}</p>
                        </div>
                    ))
                ) : (
                    <p>No bookings found.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
