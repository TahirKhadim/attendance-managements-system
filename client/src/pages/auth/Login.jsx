import { Button } from '@/components/ui/button';
import { useLoginMutation } from '@/redux/api/userApiSlice';
import { setCredentials } from '@/redux/features/auth/authSlice';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [login,{isLoading}]=useLoginMutation()
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const { userInfo } = useSelector((state) => state.auth)
    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/user/home'

    const submit =async (data) => {
        try {
            const res=await login(data).unwrap();
            localStorage.setItem("accesstoken",res.accesstoken);
            
            dispatch(setCredentials({...res}))
            toast.success("Login successfull!")
            navigate(redirect);
            
        } catch (error) {
            console.log(error);
            toast.error(error.data?.message||"Login Failed" )
            
            
        }
    };

    useEffect(() => {
        if (userInfo) {
          console.log('User info exists, redirecting to:', redirect) // Debug message
          toast.info('You are already logged in. Redirecting...')
          navigate(redirect)
        }
      }, [navigate, redirect, userInfo])

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit(submit)}>
                    <div className="mb-4">
                        <input 
                            type="email" 
                            {...register("email", {
                                required: true,
                            })}  
                            placeholder="Email"
                            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
                    </div>
                    <div className="mb-4">
                        <input 
                            type="password" 
                            {...register("password", {
                                required: true,
                            })}  
                            placeholder="Password"
                            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.password && <span className="text-red-500 text-sm">Password is required</span>}
                    </div>
                    <Button type="submit" className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600">Login</Button>
                </form>
                <p className="text-gray-600">
          Don't have an account?{' '}
          <Link className="font-semibold text-blue-500 hover:underline" to={'/register'}>
            Register
          </Link>
        </p>
            </div>
        
        </div>
    );
};

export default Login;
