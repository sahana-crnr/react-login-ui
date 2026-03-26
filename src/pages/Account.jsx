import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { FaUserCircle } from 'react-icons/fa';

const Account = () => {
    const navigate = useNavigate();
    const currentUser = useAuthStore((state) => state.currentUser);
    const logoutUser = useAuthStore((state) => state.logoutUser);

    const handleSignOut = () => {
        logoutUser();
        sessionStorage.clear();
        navigate('/', { replace: true });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10">
            <div className="flex items-center gap-4 mb-8">
                <FaUserCircle className="text-5xl text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-800">Your Account</h1>
            </div>

            {currentUser ? (
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-sm text-muted-foreground">Email Address</label>
                            <p className="text-lg font-medium">{currentUser.email}</p>
                        </div>
                        {/* You can add additional user info fields here later */}
                    </div>

                    <Button variant="destructive" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </div>
            ) : (
                <div className="text-center p-10 bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-600 mb-4">You are not logged in.</p>
                    <Button onClick={() => navigate('/login')} className="bg-purple-600 hover:bg-purple-700 text-white">
                        Go to Login
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Account;