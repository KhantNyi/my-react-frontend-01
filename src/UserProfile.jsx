import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UserProfile.css";

const API_BASE = "http://localhost:3000";

export function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const firstnameRef = useRef();
    const lastnameRef = useRef();
    const emailRef = useRef();
    const fileInputRef = useRef();

    async function loadUser() {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/user/${id}`);
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Failed to load user");
                return;
            }
            setUser(data);
        } catch (err) {
            setError("Network error: Failed to load user");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setError("");
        setSuccess("");
        const body = {
            firstname: firstnameRef.current.value,
            lastname: lastnameRef.current.value,
            email: emailRef.current.value,
        };

        try {
            const response = await fetch(`${API_BASE}/api/user/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const result = await response.json();
                setError(result.message || "Failed to update profile");
                return;
            }

            setSuccess("Profile updated successfully!");
            setEditing(false);
            loadUser();
        } catch (err) {
            setError("Network error");
        }
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Client-side validation: only image types
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setError("Only image files are allowed (JPEG, PNG, GIF, WebP)");
            fileInputRef.current.value = "";
            return;
        }

        // Client-side validation: max 5MB
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            fileInputRef.current.value = "";
            return;
        }

        setError("");
        // Show preview
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    }

    async function handleUpload() {
        const file = fileInputRef.current?.files[0];
        if (!file) {
            setError("Please select an image file first");
            return;
        }

        setError("");
        setSuccess("");
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${API_BASE}/api/user/${id}/upload`, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Upload failed");
                return;
            }

            setSuccess("Profile image uploaded successfully!");
            setImagePreview(null);
            fileInputRef.current.value = "";
            loadUser();
        } catch (err) {
            setError("Network error during upload");
        } finally {
            setUploading(false);
        }
    }

    function cancelPreview() {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    useEffect(() => {
        loadUser();
    }, [id]);

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-loading">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-container">
                <div className="profile-error-page">
                    <h2>User Not Found</h2>
                    <button onClick={() => navigate("/users")} className="btn btn-secondary">
                        ← Back to Users
                    </button>
                </div>
            </div>
        );
    }

    const profileImageUrl = user.profileImage
        ? `${API_BASE}${user.profileImage}`
        : null;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <button onClick={() => navigate("/users")} className="btn btn-back">
                    ← Back to Users
                </button>
                <h1>User Profile</h1>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="profile-card">
                {/* Profile Image Section */}
                <div className="profile-image-section">
                    <div className="profile-image-wrapper">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="profile-image" />
                        ) : profileImageUrl ? (
                            <img src={profileImageUrl} alt="Profile" className="profile-image" />
                        ) : (
                            <div className="profile-image-placeholder">
                                <span>{(user.firstname?.[0] || user.username?.[0] || "?").toUpperCase()}</span>
                            </div>
                        )}
                    </div>

                    <div className="upload-section">
                        <label className="file-input-label">
                            Choose Image
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                className="file-input-hidden"
                            />
                        </label>
                        <p className="upload-hint">JPEG, PNG, GIF, or WebP (max 5MB)</p>

                        {imagePreview && (
                            <div className="upload-actions">
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="btn btn-primary"
                                >
                                    {uploading ? "Uploading..." : "Upload"}
                                </button>
                                <button onClick={cancelPreview} className="btn btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="profile-info-section">
                    <div className="info-row">
                        <label className="info-label">ID</label>
                        <span className="info-value info-id">{user._id}</span>
                    </div>

                    {editing ? (
                        <>
                            <div className="info-row">
                                <label className="info-label">First Name</label>
                                <input
                                    ref={firstnameRef}
                                    defaultValue={user.firstname || ""}
                                    className="info-input"
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div className="info-row">
                                <label className="info-label">Last Name</label>
                                <input
                                    ref={lastnameRef}
                                    defaultValue={user.lastname || ""}
                                    className="info-input"
                                    placeholder="Enter last name"
                                />
                            </div>
                            <div className="info-row">
                                <label className="info-label">Email</label>
                                <input
                                    ref={emailRef}
                                    defaultValue={user.email || ""}
                                    type="email"
                                    className="info-input"
                                    placeholder="Enter email"
                                />
                            </div>
                            <div className="profile-actions">
                                <button onClick={handleSave} className="btn btn-primary">
                                    Save Changes
                                </button>
                                <button onClick={() => setEditing(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="info-row">
                                <label className="info-label">First Name</label>
                                <span className="info-value">{user.firstname || "—"}</span>
                            </div>
                            <div className="info-row">
                                <label className="info-label">Last Name</label>
                                <span className="info-value">{user.lastname || "—"}</span>
                            </div>
                            <div className="info-row">
                                <label className="info-label">Email</label>
                                <span className="info-value">{user.email || "—"}</span>
                            </div>
                            <div className="profile-actions">
                                <button onClick={() => setEditing(true)} className="btn btn-primary">
                                    Edit Profile
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
