'use client';
import { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { API_ENDPOINTS } from '@/utility/constants';
import { useFetchPostAPI } from '@/utility/custom-hooks';
import { handleInputChange } from '@/utility/utility-function';

export default function LoginPage() {

    const { fetchPostAPI, postingData } = useFetchPostAPI();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.LOGIN, formData, '/dashboard', onSuccess, false);
    }

    function onSuccess(data) {
        sessionStorage.setItem('token', data.data.token);
        sessionStorage.setItem('email', data.data.email);
    }

    return (

        <section className="h-screen flex items-center justify-center">

            <div className="px-5 sm:px-10 max-w-lg mx-auto">

                {/* Form Body */}
                <div className="p-5 sm:p-6 lg:p-10 border-2 border-gray-200 rounded-2xl bg-white shadow-sm">

                    <div className="text-center space-y-2 mb-8 border-b border-gray-100 pb-5">
                        <h2 className="text-2xl lg:text-3xl font-display font-bold text-gray-800">
                            Welcome Back!
                        </h2>
                        <p className="text-gray-500 text-sm lg:text-base font-nunito">
                            Sign in to your <span className="text-primary font-bold">Easy Loans Apply</span> account.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Email Field */}
                        <div className="space-y-2">

                            <label htmlFor="email" className="form-label">
                                <FaEnvelope className="text-primary/60" /> Email Address
                            </label>

                            <input id="email" name="email" type="text" autoComplete="email" value={formData.email} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" placeholder="john@example.com" />

                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">

                            <label htmlFor="password" className="form-label">
                                <FaLock className="text-primary/60" /> Password
                            </label>

                            <div className="relative">

                                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" className="form-input" placeholder="Enter your password" value={formData.password} onChange={(e) => { handleInputChange(e, setFormData) }} />

                                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-primary transition-colors" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                                    {showPassword ? (
                                        <FaEyeSlash className="h-5 w-5" />
                                    ) : (
                                        <FaEye className="h-5 w-5" />
                                    )}
                                </button>

                            </div>

                            <div className="flex justify-end pt-1">
                                <Link href="/forgot-password" className="text-sm font-bold text-primary/80 hover:text-primary transition-colors font-nunito hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>

                        </div>

                        <div className="pt-2">

                            <button type="submit" disabled={postingData} className={`w-full flex justify-center items-center py-2 px-4 text-base font-bold rounded-md text-white bg-primary hover:opacity-90 transition-opacity duration-200 ${postingData ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>

                                {postingData ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : (
                                    "Login"
                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </section>

    );
}