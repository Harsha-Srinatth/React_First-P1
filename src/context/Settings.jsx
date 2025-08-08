import Cookies from 'js-cookie';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Settings = () => {
    const navigate = useNavigate();
    const handleDeleteAccount = async () => {
        const result = await Swal.fire({
            title: 'Delete Account Permanently?',
            html: `<div style=\"color:#b91c1c;font-weight:bold;font-size:1.1rem;\">This action is <u>irreversible</u>!</div>
                <ul style=\"text-align:left;margin:1rem 0 0 0;padding-left:1.2rem;color:#991b1b;font-size:1rem;\">
                  <li>All your posts, comments, and likes will be <b>permanently deleted</b>.</li>
                  <li>Your followers and following lists will be lost.</li>
                  <li>Your profile and all account data will be erased.</li>
                  <li>You will not be able to recover your account.</li>
                </ul>
                <div style='margin-top:1rem;color:#b91c1c;font-weight:500;'>Are you absolutely sure you want to proceed?</div>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete my account',
            cancelButtonText: 'Cancel',
            focusCancel: true,
            width: 480,
        });
        if (!result.isConfirmed) return;
        const userid = Cookies.get('userid')?.replace(/^\"|\"$/g, '');
        if (!userid) {
            Swal.fire('Error', 'User ID not found. Please log in again.', 'error');
            return;
        }
        try {
            await api.delete(`/userAccount/delete/permanently/${userid}`);
            Cookies.remove('token');
            Cookies.remove('userid');
            await Swal.fire({
                title: 'Account Deleted',
                text: 'Your account and all associated data have been permanently deleted.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            });
            navigate('/register');
        } catch (error) {
            Swal.fire('Error', 'Failed to delete account. Please try again.', 'error');
        }
    };

    return (
        <div className="bg-gray-950 flex items-center justify-center min-h-screen w-full sm:px-4">
            <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden p-4 md:p-0">
                <div className="flex flex-col items-center p-4 sm:p-8">
                    <div className="flex flex-col items-center mb-4 sm:mb-6">
                        <div className="bg-red-100 rounded-full p-3 sm:p-4 mb-2 sm:mb-3">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 sm:mb-2 text-center">Delete Your Account</h1>
                        <p className="text-base sm:text-lg text-gray-700 text-center max-w-xs sm:max-w-md">Permanently delete your account and all your data. This action <span className='text-red-600 font-semibold'>cannot be undone</span>.</p>
                    </div>
                    <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 sm:p-5 mb-4 sm:mb-6">
                        <h3 className="text-base sm:text-lg font-bold text-red-700 mb-1 sm:mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414-1.414A9 9 0 105.636 18.364l1.414 1.414A9 9 0 1018.364 5.636z"></path></svg>
                            Danger Zone
                        </h3>
                        <ul className="list-disc pl-5 sm:pl-6 text-red-700 text-sm sm:text-base space-y-1">
                            <li>All your posts, comments, and likes will be <b>permanently deleted</b>.</li>
                            <li>Your followers and following lists will be lost.</li>
                            <li>Your profile and all account data will be erased.</li>
                            <li>You will not be able to recover your account.</li>
                        </ul>
                    </div>
                    <button
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 font-semibold text-base sm:text-lg flex items-center justify-center gap-2"
                        onClick={handleDeleteAccount}
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                        Delete Account Permanently
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;