import React from "react";

const Table = ({ transactions }) => {
  return (
    <table
      border="1"
      style={{
        width: "100%",
        textAlign: "left",
        borderCollapse: "collapse",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <thead>
        <tr
          style={{
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontSize: "14px",
          }}
        >
          <th style={{ padding: "12px 15px" }}>ID</th>
          <th style={{ padding: "12px 15px" }}>Title</th>
          <th style={{ padding: "12px 15px" }}>Description</th>
          <th style={{ padding: "12px 15px" }}>Price</th>
          <th style={{ padding: "12px 15px" }}>Category</th>
          <th style={{ padding: "12px 15px" }}>Sold</th>
          <th style={{ padding: "12px 15px" }}>Image</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <tr
              key={transaction.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#f1f1f1";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor =
                  index % 2 === 0 ? "#f8f9fa" : "#ffffff";
              }}
            >
              <td style={{ padding: "10px 15px" }}>{transaction.id}</td>
              <td style={{ padding: "10px 15px" }}>{transaction.title}</td>
              <td style={{ padding: "10px 15px" }}>{transaction.description}</td>
              <td style={{ padding: "10px 15px" }}>${transaction.price}</td>
              <td style={{ padding: "10px 15px" }}>{transaction.category}</td>
              <td style={{ padding: "10px 15px" }}>
                {transaction.sold ? "Yes" : "No"}
              </td>
              <td style={{ padding: "10px 15px" }}>
                <img
                  src={transaction.image}
                  alt="Transaction"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "5px",
                    objectFit: "cover",
                  }}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
              No transactions found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
