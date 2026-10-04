export default function AdminTopBar({ onMenuClick }) {

    return (
        <div className="p-4 flex justify-between items-center h-20 bg-gray-200">
            {/* Menu Button for Mobile */}
            <button onClick={onMenuClick} className="lg:hidden flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

        </div>
    );
} 