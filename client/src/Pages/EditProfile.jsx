import React, { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const EditProfile = () => {
    const { user, setUser } = useUser()
    const navigate = useNavigate()

    const [newFirstName, setNewFirstName] = useState('')
    const [newLastName, setNewLastName] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [showNamePanel, setShowNamePanel] = useState(false)
    const [showPasswordPanel, setShowPasswordPanel] = useState(false)
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState({ show: false, text: '', type: 'success' })

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [toast])


    useEffect(() => {
        if (user?.fullname) {
            setNewFirstName(user.fullname.firstname)
            setNewLastName(user.fullname.lastname)
        }
    }, [user])

    // Update Name
    const handleSaveName = async () => {
        try {
            setLoading(true)


            const res = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/user/update-profile`,
                {
                    firstname: newFirstName,
                    lastname: newLastName
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            setUser(res.data.user)
            setShowNamePanel(false)
            setToast({ show: true, text: 'Name updated successfully!', type: 'success' })



        } catch (err) {
            setToast({ show: true, text: 'Something went wrong! Failed to change Name', type: 'error' })

            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    // Change Password
    const handleChangePassword = async () => {
        try {
            setLoading(true)


            await axios.put(
                `${import.meta.env.VITE_BASE_URL}/user/change-password`,
                {
                    oldPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            setOldPassword('')
            setNewPassword('')
            setShowPasswordPanel(false)
            setToast({ show: true, text: 'Password updated successfully!', type: 'success' })



        } catch (err) {
            setToast({ show: true, text: 'Something went wrong! Faild to change Password', type: 'error' })
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-blue-50 min-h-screen flex flex-col">

            {/* HEADER */}
            <div className="fixed left-0 right-0 top-3 mx-4 bg-white shadow-xl rounded-lg py-3 flex items-center justify-center z-50">
                <i
                    onClick={() => navigate(-1)}
                    className="ri-arrow-left-wide-line absolute left-5 text-[25px] cursor-pointer"
                ></i>
                <h2 className="text-[22px] font-semibold font-serif">Edit Profile</h2>
            </div>

            {/* CONTENT */}
            <div className="mt-[90px] mx-3 flex flex-col gap-4">

                {toast.show && (
                    <div
                        className={`fixed bottom-[50px] w-screen  flex text-center left-1/2 -translate-x-1/2 font-serif font-semibold z-50 transition
                        ${toast.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
                    >
                        {toast.text}
                    </div>
                )}


                {/* CHANGE NAME */}
                <div className='flex flex-col py-3 px-3 bg-white rounded-lg shadow-xl'>
                    <div
                        onClick={() => setShowNamePanel(!showNamePanel)}
                        className='flex flex-row items-center justify-between cursor-pointer'
                    >
                        <div className='flex gap-4 items-center'>
                            <i className="ri-edit-box-line text-[22px] text-gray-400"></i>
                            <h3 className='text-[16px] font-semibold font-serif'>
                                Change your Name
                            </h3>
                        </div>
                        <i
                            className={`ri-arrow-right-s-line text-[22px] transition-transform duration-300 ${showNamePanel ? 'rotate-90' : ''
                                }`}
                        ></i>
                    </div>

                    <AnimatePresence>
                        {showNamePanel && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden mt-4 flex flex-col gap-3"
                            >
                                <div className='flex items-center'>
                                    <h2 className='w-2/5 text-[15px] font-serif font-semibold'>First Name:</h2>
                                    <input
                                        className="w-3/5 border rounded-lg font-serif px-3 py-2 outline-none"
                                        value={newFirstName}
                                        onChange={(e) => setNewFirstName(e.target.value)}
                                    />
                                </div>

                                <div className='flex items-center'>
                                    <h2 className='w-2/5 text-[15px] font-serif font-semibold'>Last Name:</h2>
                                    <input
                                        className="w-3/5 border rounded-lg font-serif px-3 py-2 outline-none"
                                        value={newLastName}
                                        onChange={(e) => setNewLastName(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={handleSaveName}
                                    disabled={loading}
                                    className="bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-60"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* CHANGE PASSWORD */}
                <div className='flex flex-col py-3 px-3 bg-white rounded-lg shadow-xl'>
                    <div
                        onClick={() => setShowPasswordPanel(!showPasswordPanel)}
                        className='flex flex-row items-center justify-between cursor-pointer'
                    >
                        <div className='flex gap-4 items-center'>
                            <i className="ri-lock-password-line text-[22px] text-gray-400"></i>
                            <h3 className='text-[16px] font-semibold font-serif'>
                                Change Your Password
                            </h3>
                        </div>
                        <i
                            className={`ri-arrow-right-s-line text-[22px] transition-transform duration-300 ${showPasswordPanel ? 'rotate-90' : ''
                                }`}
                        ></i>
                    </div>

                    <AnimatePresence>
                        {showPasswordPanel && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden mt-4 flex flex-col gap-3"
                            >
                                <div className='flex items-center'>
                                    <h2 className='w-2/5 font-serif text-[15px] font-semibold'>
                                        Old Password:
                                    </h2>
                                    <input
                                        type="password"
                                        className="w-3/5 border rounded-lg px-3 py-2 outline-none"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="Enter old password"
                                    />
                                </div>

                                <div className='flex items-center'>
                                    <h2 className='w-2/5 font-serif text-[15px] font-semibold'>
                                        New Password:
                                    </h2>
                                    <input
                                        type="password"
                                        className="w-3/5 border rounded-lg px-3 py-2 outline-none"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={loading}
                                    className="bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-60"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    )
}

export default EditProfile
