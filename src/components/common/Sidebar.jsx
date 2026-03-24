import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBars, FaTimes, FaHeart, FaBoxOpen,
    FaUserCircle, FaSignOutAlt, FaChevronDown
} from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import './Sidebar.css';
import useAuthStore from '../../store/useAuthStore';
import useShopStore from '../../store/useShopStore';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const navigate = useNavigate();
    const wishlist = useShopStore((state) => state.wishlist);
    const wishlistCount = wishlist.length;
    const logoutUser = useAuthStore((state) => state.logoutUser);

    // Handlers
    const toggleSidebar = () => setIsOpen(!isOpen);
    const toggleCategories = () => setIsCategoryOpen(!isCategoryOpen);

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false); // Close the sidebar after navigating
    };

    const handleSignOut = () => {
        logoutUser();
        sessionStorage.clear();

        setIsOpen(false);
        navigate('/'); // Redirects to the root/login page. Change to '/login' if your route specifically requires it.
    };

    return (
        <>
            {/* Hamburger Menu Icon (3 lines) */}
            <div className="hamburger-icon" onClick={toggleSidebar}>
                <FaBars size={24} />
            </div>

            {/* Dark Overlay (Clicking outside closes the sidebar) */}
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar Container */}
            <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Menu</h2>
                    <button className="close-btn" onClick={toggleSidebar}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="sidebar-content">
                    {/* Main Links */}
                    <div className="sidebar-item" onClick={toggleCategories}>
                        <MdCategory className="item-icon" />
                        <span className="item-label">Products Category</span>
                        <FaChevronDown className={`chevron ${isCategoryOpen ? 'rotated' : ''}`} />
                    </div>

                    {/* Collapsible Categories List */}
                    <div className={`categories-list ${isCategoryOpen ? 'expanded' : ''}`}>
                        <ul>
                            <li>Electronics</li>
                            <li>Fashion & Apparel</li>
                            <li>Home & Furniture</li>
                            <li>Books & Media</li>
                            <li>Sports & Outdoors</li>
                        </ul>
                    </div>

                    <div className="sidebar-item" onClick={() => handleNavigation('/wishlist')}>
                        <FaHeart className="item-icon" />
                        <span className="item-label">My Wishlist</span>
                        {wishlistCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                                {wishlistCount}
                            </span>
                        )}
                    </div>

                    <div className="sidebar-item" onClick={() => handleNavigation('/orders')}>
                        <FaBoxOpen className="item-icon" />
                        <span className="item-label">My Orders</span>
                    </div>

                    <hr className="divider" />

                    {/* Help & Settings Section */}
                    <h3 className="section-title">Help & Settings</h3>

                    <div className="sidebar-item" onClick={() => handleNavigation('/account')}>
                        <FaUserCircle className="item-icon" />
                        <span className="item-label">Your Account</span>
                    </div>

                    <div className="sidebar-item sign-out" onClick={handleSignOut}>
                        <FaSignOutAlt className="item-icon" />
                        <span className="item-label">Sign Out</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;