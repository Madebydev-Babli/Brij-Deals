
export default function Tabs({ tabs, activeTab, setActiveTab }) {

    return (
        <>
            <section className="mb-6 w-full max-w-full overflow-hidden">

                <div className="flex gap-1 border-b border-gray-200 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">

                    {tabs.map((tab) => {

                        const isActive = activeTab === tab.id;

                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 rounded-t-md text-sm font-medium transition-all duration-200 cursor-pointer flex items-center shrink-0 ${isActive ? "bg-primary text-white" : "text-gray-500 hover:text-primary hover:bg-primary/10"}`}  >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        );

                    })}

                </div>

            </section>
        </>
    );
}