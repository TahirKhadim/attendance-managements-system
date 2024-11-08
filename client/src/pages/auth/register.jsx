import { Button } from '@/components/ui/button';
import { useRegisterMutation } from '@/redux/api/userApiSlice';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [registerUser, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState(null);
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/login';

    const { userinfo } = useSelector((state) => state.auth);

    const submit = async (data) => {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);

        // Check for avatar
        if (!avatar) {
            toast.error("Avatar is required");
            return; // Exit early if the avatar is not provided
        }
        formData.append('avatar', avatar); // Append avatar only if it exists

        try {
            // Register the user
            const res = await registerUser(formData).unwrap();
            
            toast.success("User registered successfully!");
            navigate('/login'); // Redirect to login after registration
            
        } catch (error) {
            console.error(error);
            toast.error(error.data?.message || "Registration Failed");
        }
    };

    const handleAvatarChange = (e) => {
        if (e.target.files.length > 0) {
            setAvatar(e.target.files[0]); // Get the selected file
        }
    };

    useEffect(() => {
        if (userinfo) {
            navigate(redirect);
        }
    }, [navigate, userinfo, redirect]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit(submit)}>
                    <div className="mb-4">
                        <input 
                            {...register("username", {
                                required: "Username is required",
                                minLength: { value: 3, message: "Minimum length is 3" },
                                maxLength: { value: 10, message: "Maximum length is 10" }
                            })} 
                            type="text" 
                            placeholder='Enter username' 
                            className={`w-full p-2 border rounded ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                    </div>
                    
                    <div className="mb-4">
                        <input 
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Valid email is required"
                                }
                            })} 
                            type="email" 
                            placeholder='Type email' 
                            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>

                    <div className="mb-4">
                        <input 
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                            })} 
                            type="password" 
                            placeholder='Enter password' 
                            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>

                    <div className="mb-4">
                        <input 
                            {...register("cpassword", {
                                required: "Confirm password is required",
                                validate: value => value === watch('password') || "Passwords do not match"
                            })} 
                            type="password" 
                            placeholder='Confirm password' 
                            className={`w-full p-2 border rounded ${errors.cpassword ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.cpassword && <span className="text-red-500 text-sm">{errors.cpassword.message}</span>}
                    </div>

                    <div className="mb-4">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAvatarChange}
                            className={`w-full p-2 border rounded ${!avatar ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {!avatar && <span className="text-red-500 text-sm">Avatar is required</span>}
                    </div>

                    <Button type="submit" className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                    </Button>
                </form>
                <p className="text-gray-600 mt-4">
                    Already have an account?{' '}
                    <Link className="font-semibold text-blue-500 hover:underline" to={'/login'}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
