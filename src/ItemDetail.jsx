import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const itemNameRef = useRef();
    const itemCategoryRef = useRef();
    const itemPriceRef = useRef();

    async function loadItem() {
        const result = await fetch(`http://localhost:3000/api/item/${id}`);
        const data = await result.json();
        itemNameRef.current.value = data.itemName;
        itemCategoryRef.current.value = data.itemCategory;
        itemPriceRef.current.value = data.itemPrice;
    }

    async function onUpdate() {
        const body = {
            name: itemNameRef.current.value,
            category: itemCategoryRef.current.value,
            price: itemPriceRef.current.value
        };
        await fetch(`http://localhost:3000/api/item/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body)
        });
        alert("Update Successful!");
        navigate("/");
    }

    useEffect(() => { loadItem(); }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <div style={{ width: "400px", padding: "25px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <h3 style={{ borderBottom: "2px solid #007bff", paddingBottom: "10px" }}>Edit Item</h3>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Item Name</label>
                    <input ref={itemNameRef} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Category</label>
                    <select ref={itemCategoryRef} style={{ width: "100%", padding: "10px" }}>
                        <option>Stationary</option>
                        <option>Kitchenware</option>
                        <option>Appliance</option>
                    </select>
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Price ($)</label>
                    <input ref={itemPriceRef} style={{ width: "100%", padding: "10px" }} />
                </div>
                <button onClick={onUpdate} style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%" }}>Save Changes</button>
                <button onClick={() => navigate("/")} style={{ backgroundColor: "transparent", color: "#666", padding: "10px", border: "none", cursor: "pointer", width: "100%", marginTop: "10px" }}>Cancel</button>
            </div>
        </div>
    );
}