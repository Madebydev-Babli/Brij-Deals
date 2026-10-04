export default function PaginationSection({ query, setQuery, extra, loading }) {
    return (
        <>
            <div className="flex flex-col lg:flex-row gap-5 items-center justify-between m-5">

                <div className="flex items-center gap-2">

                    <label htmlFor="rowsPerPage" className="text-sm text-gray-700">Rows per page:</label>

                    <select
                        name="rowsPerPage"
                        id="rowsPerPage"
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={query.limit}
                        onChange={(e) => {
                            window.scrollTo({ top: 0 });
                            setQuery({ ...query, page: 1, limit: parseInt(e.target.value) });
                        }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>

                </div>

                <span className="text-sm text-gray-700 hidden lg:block">
                    {((extra.page - 1) * extra.limit) + 1} to {Math.min(extra.totalFilteredData, extra.totalData)} of {extra.totalData} Records
                </span>

                <div className="flex items-center gap-4">

                    <button
                        className={`${(extra.page == 1 || loading) ? 'bg-gray-500' : 'bg-primary'} text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:opacity-90 disabled:cursor-not-allowed`}
                        onClick={() => {
                            window.scrollTo({ top: 0 });
                            setQuery((prev) => ({ ...prev, page: prev.page - 1 }));
                        }}
                        disabled={extra.page == 1 || loading}
                    >
                        Previous
                    </button>

                    <span className="text-sm font-semibold text-gray-700">Page {extra.page} of {extra.totalPages}</span>

                    <button
                        className={`${(extra.page === extra.totalPages || loading) ? 'bg-gray-500' : 'bg-primary'} text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:opacity-90 disabled:cursor-not-allowed`}
                        onClick={() => {
                            window.scrollTo({ top: 0 });
                            setQuery((prev) => ({ ...prev, page: prev.page + 1 }));

                        }}
                        disabled={extra.page === extra.totalPages || loading}
                    >
                        Next
                    </button>

                </div>

            </div>
        </>
    )
}