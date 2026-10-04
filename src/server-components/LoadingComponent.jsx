export default function LoadingComponent({ message = "Verifying Authentication..." }) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center space-y-4 pb-[150px]">

            <div className="relative flex items-center justify-center">

                <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>

            </div>

            <h1 className="text-xl font-semibold text-gray-800">
                {message}
            </h1>

        </div>
    );
}