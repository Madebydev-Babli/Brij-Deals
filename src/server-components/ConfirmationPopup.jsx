import { FiAlertCircle } from "react-icons/fi";

export default function ConfirmationPopup({ show, onConfirm, onCancel, title, message, loading, confirmText, loadingText }) {
    return (
        <>
            {show && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">

                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">

                        <div className="p-6 text-center">

                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiAlertCircle className="w-8 h-8 text-red-500" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                            <p className="text-gray-500 mb-6">{message}</p>

                            <div className="flex gap-3 justify-center">

                                <button onClick={onCancel} className="bg-gray-300 cursor-pointer text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
                                    Cancel
                                </button>

                                <button onClick={onConfirm} disabled={loading} className="cursor-pointer text-white px-4 py-2 rounded-md bg-red-600 hover:bg-red-700">
                                    {loading ? loadingText : confirmText}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}
        </>
    )
}