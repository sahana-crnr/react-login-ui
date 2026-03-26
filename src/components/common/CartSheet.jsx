import React from 'react';
import { useNavigate } from 'react-router-dom';
import useShopStore, { getCartTotalItems, getCartTotalPrice } from '../../store/useShopStore';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "../ui/sheet";
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { FaTrash } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';

export default function CartSheet() {
    const navigate = useNavigate();
    const { isCartOpen, closeCart, cart, removeFromCart } = useShopStore();
    const cartTotalPrice = useShopStore(getCartTotalPrice);
    const cartTotalItems = useShopStore(getCartTotalItems);

    const handleNavigate = (path) => {
        navigate(path);
        closeCart();
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={closeCart}>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>My Cart ({cartTotalItems})</SheetTitle>
                </SheetHeader>
                <Separator />
                {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                        <FiShoppingCart className="text-6xl text-muted-foreground" />
                        <p className="text-lg text-muted-foreground">Your cart is empty.</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center gap-4 py-4">
                                <img src={item.image?.startsWith('/') ? process.env.PUBLIC_URL + item.image : item.image} alt={item.name} className="w-16 h-16 object-contain rounded-md border p-1" />
                                <div className="flex-1">
                                    <p className="font-semibold line-clamp-1">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    <p className="font-bold text-sm mt-1">₹{item.price * item.quantity}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => removeFromCart(item.id)}>
                                    <FaTrash size={14} />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                {cart.length > 0 && (
                    <SheetFooter className="flex flex-col gap-4 sm:flex-col pt-4 border-t">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Subtotal</span>
                            <span>₹{cartTotalPrice}</span>
                        </div>
                        <Button onClick={() => handleNavigate('/cart')} className="w-full bg-purple-600 hover:bg-purple-700">View Cart & Checkout</Button>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}