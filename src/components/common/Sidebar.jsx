import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBars, FaHeart, FaBoxOpen,
    FaUserCircle, FaSignOutAlt, FaChevronDown
} from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import useAuthStore from '../../store/useAuthStore';
import useShopStore from '../../store/useShopStore';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";
import { Button } from '../ui/button';

const Sidebar = () => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const navigate = useNavigate();
    const wishlist = useShopStore((state) => state.wishlist);
    const wishlistCount = wishlist.length;

    // Handlers
    const toggleCategories = () => setIsCategoryOpen(!isCategoryOpen);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleSignOut = () => {
        const { currentUser, updateUserData, logoutUser } = useAuthStore.getState();
        const { cart, wishlist } = useShopStore.getState();

        // 1. Save data to the user's permanent profile
        if (currentUser) {
            updateUserData(currentUser.email, cart, wishlist);
        }

        // 2. Clear user session but keep the shop data
        logoutUser();

        navigate('/', { replace: true });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" >
                    <FaBars size={24} />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-0">
                <SheetHeader className="p-6 pb-4">
                    <SheetTitle className="text-2xl font-bold text-purple-700">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    <div className="flex-1 px-4 py-2 space-y-1">
                        {/* Main Links */}
                        <Button variant="ghost" onClick={toggleCategories} className="w-full justify-between text-base h-12">
                            <div className="flex items-center gap-4">
                                <MdCategory className="h-5 w-5" />
                                <span>Products Category</span>
                            </div>
                            <FaChevronDown className={`h-4 w-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </Button>

                        {/* Collapsible Categories List */}
                        <div className={`pl-8 transition-all duration-300 overflow-hidden ${isCategoryOpen ? 'max-h-60' : 'max-h-0'}`}>
                            <ul className="py-2 space-y-2 text-gray-600">
                                <li className="hover:text-purple-600 cursor-pointer">Electronics</li>
                                <li className="hover:text-purple-600 cursor-pointer">Fashion & Apparel</li>
                                <li className="hover:text-purple-600 cursor-pointer">Home & Furniture</li>
                                <li className="hover:text-purple-600 cursor-pointer">Books & Media</li>
                                <li className="hover:text-purple-600 cursor-pointer">Sports & Outdoors</li>
                            </ul>
                        </div>
                        {/* button */}
                        <Button variant="ghost" onClick={() => handleNavigation('/wishlist')} className="w-full justify-start text-base h-12 gap-4">
                            <FaHeart className="h-5 w-5" />
                            <span>My Wishlist</span>
                            {wishlistCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </Button>

                        <Button variant="ghost" onClick={() => handleNavigation('/orders')} className="w-full justify-start text-base h-12 gap-4">
                            <FaBoxOpen className="h-5 w-5" />
                            <span>My Orders</span>
                        </Button>
                    </div>

                    <div className="p-4 border-t border-gray-200 mt-auto">
                        <Button variant="ghost" onClick={() => handleNavigation('/account')} className="w-full justify-start text-base h-12 gap-4">
                            <FaUserCircle className="h-5 w-5" />
                            <span>Your Account</span>
                        </Button>
                        <Button variant="destructive" onClick={handleSignOut} className="w-full justify-start text-base h-12 gap-4 mt-2">
                            <FaSignOutAlt className="h-5 w-5" />
                            <span>Sign Out</span>
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Sidebar;