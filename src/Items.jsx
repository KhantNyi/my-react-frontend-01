import { useEffect, useRef, useState } from "react";

export function Items() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const itemNameRef = useRef();
    const itemCategoryRef = useRef();
    const itemPriceRef = useRef();

    async function loadItems() {
        try {
            const response = await fetch(`http://localhost:3000/api/item?page=${page}`);
            const data = await response.json();
            setItems(data);
        } catch (err) {
            alert("Loading failed");
        }
    }

    async function onDelete(id) {
        if (!confirm("Delete this item?")) return;
        await fetch(`http://localhost:3000/api/item/${id}`, { method: "DELETE" });
        loadItems();
    }

    async function onItemSave() {
        const body = {
            name: itemNameRef.current.value,
            category: itemCategoryRef.current.value,
            price: itemPriceRef.current.value
        };
        await fetch("http://localhost:3000/api/item", {
            method: "POST",
            body: JSON.stringify(body)
        });
        itemNameRef.current.value = "";
        itemPriceRef.current.value = "";
        loadItems();
    }

    useEffect(() => { loadItems(); }, [page]);

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2 style={{ color: "#333" }}>Item Management</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                        <th style={{ padding: "12px" }}>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th> 
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={{ padding: "12px" }}>{item.itemName}</td>
                            <td>{item.itemCategory}</td>
                            <td>${item.itemPrice}</td>
                            {/* Added Status Badge */}
                            <td>
                                <span style={{ 
                                    backgroundColor: "#e6fffa", 
                                    color: "#2c7a7b", 
                                    padding: "4px 8px", 
                                    borderRadius: "4px", 
                                    fontSize: "0.8rem", 
                                    fontWeight: "bold" 
                                }}>
                                    {item.status || "ACTIVE"}
                                </span>
                            </td>
                            <td>
                                <a href={`/items/${item._id}`} style={{ color: "#007bff", textDecoration: "none", marginRight: "10px" }}>Edit</a>
                                <button onClick={() => onDelete(item._id)} style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    <tr style={{ backgroundColor: "#fafafa" }}>
                        <td><input ref={itemNameRef} placeholder="Item Name" style={{ padding: "8px", width: "90%" }} /></td>
                        <td>
                            <select ref={itemCategoryRef} style={{ padding: "8px" }}>
                                <option>Stationary</option>
                                <option>Kitchenware</option>
                                <option>Appliance</option>
                            </select>
                        </td>
                        <td><input ref={itemPriceRef} placeholder="Price" style={{ padding: "8px", width: "80px" }} /></td>
                        <td></td> 
                        <td><button onClick={onItemSave} style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}>+ Add</button></td>
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