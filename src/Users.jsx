import { useEffect, useRef, useState } from "react";

export function Users() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");
    const [editingUser, setEditingUser] = useState(null);

    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const firstnameRef = useRef();
    const lastnameRef = useRef();

    // Edit form refs
    const editUsernameRef = useRef();
    const editEmailRef = useRef();
    const editFirstnameRef = useRef();
    const editLastnameRef = useRef();

    async function loadUsers() {
        try {
            const response = await fetch(`http://localhost:3000/api/user?page=${page}`);
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            alert("Loading failed");
        }
    }

    async function onUserSave() {
        setError("");
        const body = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            firstname: firstnameRef.current.value,
            lastname: lastnameRef.current.value
        };

        if (!body.username || !body.email || !body.password) {
            setError("Username, email and password are required");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Failed to create user");
                return;
            }

            // Clear form
            usernameRef.current.value = "";
            emailRef.current.value = "";
            passwordRef.current.value = "";
            firstnameRef.current.value = "";
            lastnameRef.current.value = "";

            loadUsers();
        } catch (err) {
            setError("Network error");
        }
    }

    async function onDelete(id) {
        if (!confirm("Delete this user?")) return;
        try {
            await fetch(`http://localhost:3000/api/user/${id}`, { method: "DELETE" });
            loadUsers();
        } catch (err) {
            setError("Failed to delete user");
        }
    }

    function startEdit(user) {
        setEditingUser(user);
    }

    function cancelEdit() {
        setEditingUser(null);
    }

    async function onUserUpdate() {
        setError("");
        const body = {
            username: editUsernameRef.current.value,
            email: editEmailRef.current.value,
            firstname: editFirstnameRef.current.value,
            lastname: editLastnameRef.current.value
        };

        try {
            const response = await fetch(`http://localhost:3000/api/user/${editingUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const result = await response.json();
                setError(result.message || "Failed to update user");
                return;
            }

            setEditingUser(null);
            loadUsers();
        } catch (err) {
            setError("Network error");
        }
    }

    useEffect(() => { loadUsers(); }, [page]);

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2 style={{ color: "#333" }}>User Management</h2>

            {error && (
                <div style={{
                    backgroundColor: "#ffebee",
                    color: "#c62828",
                    padding: "10px",
                    borderRadius: "4px",
                    marginBottom: "15px"
                }}>
                    {error}
                </div>
            )}

            {/* Edit Modal */}
            {editingUser && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white", padding: "20px", borderRadius: "8px",
                        width: "400px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                    }}>
                        <h3 style={{ marginTop: 0 }}>Edit User</h3>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Username:</label>
                            <input ref={editUsernameRef} defaultValue={editingUser.username} style={{ width: "100%", padding: "8px", marginTop: "4px" }} />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Email:</label>
                            <input ref={editEmailRef} defaultValue={editingUser.email} type="email" style={{ width: "100%", padding: "8px", marginTop: "4px" }} />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label>First Name:</label>
                            <input ref={editFirstnameRef} defaultValue={editingUser.firstname} style={{ width: "100%", padding: "8px", marginTop: "4px" }} />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Last Name:</label>
                            <input ref={editLastnameRef} defaultValue={editingUser.lastname} style={{ width: "100%", padding: "8px", marginTop: "4px" }} />
                        </div>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            <button onClick={cancelEdit} style={{ padding: "8px 15px", cursor: "pointer" }}>Cancel</button>
                            <button onClick={onUserUpdate} style={{ backgroundColor: "#007bff", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                        <th style={{ padding: "12px" }}>Username</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={{ padding: "12px" }}>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.firstname || "-"}</td>
                            <td>{user.lastname || "-"}</td>
                            <td>
                                <span style={{
                                    backgroundColor: user.status === "ACTIVE" ? "#e6fffa" : "#fff3e0",
                                    color: user.status === "ACTIVE" ? "#2c7a7b" : "#e65100",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "0.8rem",
                                    fontWeight: "bold"
                                }}>
                                    {user.status || "ACTIVE"}
                                </span>
                            </td>
                            <td>
                                <button onClick={() => startEdit(user)} style={{ color: "#007bff", background: "none", border: "none", cursor: "pointer", marginRight: "10px" }}>Edit</button>
                                <button onClick={() => onDelete(user._id)} style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    <tr style={{ backgroundColor: "#fafafa" }}>
                        <td><input ref={usernameRef} placeholder="Username *" style={{ padding: "8px", width: "90%" }} /></td>
                        <td><input ref={emailRef} placeholder="Email *" type="email" style={{ padding: "8px", width: "90%" }} /></td>
                        <td><input ref={firstnameRef} placeholder="First Name" style={{ padding: "8px", width: "90%" }} /></td>
                        <td><input ref={lastnameRef} placeholder="Last Name" style={{ padding: "8px", width: "90%" }} /></td>
                        <td colSpan="2">
                            <input ref={passwordRef} placeholder="Password *" type="password" style={{ padding: "8px", width: "70px", marginRight: "8px" }} />
                            <button onClick={onUserSave} style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}>+ Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} style={{ padding: "8px 15px", margin: "5px", cursor: "pointer" }}>Prev</button>
                <span style={{ fontWeight: "bold" }}>Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} style={{ padding: "8px 15px", margin: "5px", cursor: "pointer" }}>Next</button>
            </div>
        </div>
    );
}
