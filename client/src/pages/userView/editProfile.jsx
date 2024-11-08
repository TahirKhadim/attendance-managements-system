import { Button } from '@/components/ui/button';
import { useChangeAvatarMutation, useUpdateInfoMutation } from '@/redux/api/userApiSlice';
import { setCredentials } from '@/redux/features/auth/authSlice';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const EditProfile = () => {
    const { register, handleSubmit, reset } = useForm();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const user = userInfo?.user;

    const [updateUser, { isLoading, error }] = useUpdateInfoMutation();
    const [changeAvatar, { isLoading: isLoadingAvatar }] = useChangeAvatarMutation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar);

    useEffect(() => {
        if (user) {
            reset({
                username: user.username,
                email: user.email,
            });
            setAvatarPreview(user.avatar); // Initialize the avatar preview
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        const payload = {
            username: data.username,
            email: data.email,
        };

        try {
            const response = await updateUser({ id: user._id, data: payload }).unwrap();
            dispatch(setCredentials(response.data));
            toast.success("Profile updated successfully!");
            // Optional: You can reset the form here instead of navigating away
            reset({
                username: response.data.username,
                email: response.data.email,
            });
        } catch (err) {
            console.error('Update error:', err);
            toast.error(err.data?.message || "Failed to update profile");
        }
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const fileURL = URL.createObjectURL(file); // Create a local URL for the selected file
            setAvatarPreview(fileURL); // Update the preview to the selected file
            toast.success("File selected: " + file.name);
        } else {
            toast.error("No file selected");
        }
    };

    const handleAvatarUpdate = async () => {
        if (!selectedFile) {
            toast.error("No file selected for upload");
            return;
        }

        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            await changeAvatar(formData).unwrap();
            toast.success("Avatar updated successfully!");
            setSelectedFile(null); // Reset file selection
        } catch (err) {
            console.error('Avatar update error:', err);
            toast.error(err.data?.message || "Failed to update avatar");
        }
    };

    if (isLoading || isLoadingAvatar) return <div>Loading...</div>; // Show loading while either is loading

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <img src={avatarPreview} alt="User Avatar" className='bg-cover h-64 w-full' />
            
            <input 
                type="file" 
                onChange={handleAvatarChange}
                className="border p-2 mt-2 w-full"
            />
            <Button onClick={handleAvatarUpdate} className='ml-4 mt-4' disabled={isLoadingAvatar}>Update Avatar</Button>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <input 
                    {...register('username', { required: true })} 
                    type="text" 
                    placeholder="Username" 
                    className="border p-2 w-full"
                />
                <input 
                    {...register('email', { required: true })} 
                    type="email" 
                    placeholder="Email" 
                    className="border p-2 mt-2 w-full"
                />
                <Button type="submit" className='ml-4 mt-4'>Update Profile</Button>
            </form>
            {error && <div className="text-red-500 mt-2">Failed to update profile. Please try again.</div>}
        </div>
    );
};

export default EditProfile;
