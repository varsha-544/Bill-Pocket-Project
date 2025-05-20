import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/leftnav.css";

function LeftNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const pages = [
        { name: ".Home", path: "/" },
        { name: ".Goals", path: "/goal" },
        { name: ".Statement", path: "/statement" },
        { name: ".About", path: "/about" },
        { name: ".Profile", path: "/profile" },
    ];

    return (
        <div className="left-nav">
            {pages.map((page, index) => (
                <div
                    key={index}
                    className={`nav-item ${
                        location.pathname === page.path ? "active" : ""
                    }`}
                    onClick={() => navigate(page.path)}
                >
                    {page.name}
                </div>
            ))}
        </div>
    );
}

export default LeftNav;