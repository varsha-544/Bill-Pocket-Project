import React from "react";
import { Link } from "react-router-dom";
import "../CSS/tophead.css";

function TopHead() {
    return (
        <div className="top-header">
            <Link to="/" className="header-link">
                BILL <br /> POCKET
            </Link>
        </div>
    );
}

export default TopHead;