"use client";

import { useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { RiDeleteBin7Line } from "react-icons/ri";
import ConfirmationPopup from "@/server-components/ConfirmationPopup";
import NoDataComponent from "@/server-components/NoDataComponent";
import PaginationSection from "@/server-components/PaginationSection";
import { handleImageChange, handleInputChange } from "@/utility/utility-function";

function imageUrl(image) {
    return typeof image === "string" ? image : image?.data || image?.url || "";
}

function Field({ field, value, setFormData }) {
    if (field.name === "sno") {
        return (
            <div>
                <label htmlFor="sno" className="form-label">S.No.</label>
                <input
                    placeholder="Enter the serial number"
                    type="text"
                    id="sno"
                    name="sno"
                    value={value ?? ""}
                    onChange={(event) => handleInputChange(event, setFormData)}
                    className="form-input"
                />
                <p className="gray-600 text-xs">Leave this field empty if you want to add the Hotel in the last</p>
            </div>
        );
    }

    if (field.type === "select") {
        return (
            <div>
                <label htmlFor={field.name} className="form-label">{field.label}</label>
                <select id={field.name} name={field.name} value={value ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input">
                    <option value="">{field.placeholder}</option>
                    {field.options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        );
    }

    if (field.type === "textarea") {
        return (
            <div className={field.wrapperClassName || ""}>
                <label htmlFor={field.name} className="form-label">{field.label}</label>
                <textarea
                    placeholder={field.placeholder}
                    id={field.name}
                    name={field.name}
                    value={value ?? ""}
                    rows="2"
                    onChange={(event) => handleInputChange(event, setFormData)}
                    className="form-input"
                />
            </div>
        );
    }

    if (field.type === "image") {
        const src = imageUrl(value);
        return (
            <div className={field.wrapperClassName || ""}>
                <label htmlFor={field.name} className="form-label">{field.label}</label>
                <input
                    type="file"
                    id={field.name}
                    name={field.name}
                    accept="image/*"
                    onChange={(event) => handleImageChange(event, setFormData)}
                    className="form-input"
                />
                {src && <img src={src} alt={`${field.label} Preview`} width={100} height={100} className="mt-2 object-cover" />}
            </div>
        );
    }

    return (
        <div className={field.wrapperClassName || ""}>
            <label htmlFor={field.name} className="form-label">{field.label}</label>
            <input
                placeholder={field.placeholder}
                type={field.type || "text"}
                id={field.name}
                name={field.name}
                value={value ?? ""}
                onChange={(event) => handleInputChange(event, setFormData)}
                className="form-input"
            />
        </div>
    );
}

function SerialSortButton({ query, setQuery, sortKey = "sno", children = "S.N." }) {
    return (
        <button
            className="flex cursor-pointer items-center gap-1"
            onClick={() => {
                if (query.sortKey !== sortKey) {
                    setQuery((previous) => ({ ...previous, sortKey, sortOrder: "-1", page: 1 }));
                } else if (query.sortOrder === "-1") {
                    setQuery((previous) => ({ ...previous, sortOrder: "1", page: 1 }));
                } else {
                    setQuery((previous) => ({ ...previous, sortKey: null, sortOrder: null, page: 1 }));
                }
            }}
            title={`Sort by ${children}`}
        >
            <span>{children}</span>
            <span className="text-xs">
                {query.sortKey === sortKey
                    ? (query.sortOrder === "-1" ? "▼" : "▲")
                    : <span className="flex flex-col items-center"><span>▲</span><span>▼</span></span>}
            </span>
        </button>
    );
}

function SerialNumber({ value }) {
    return value < 10 ? `0${value}` : value;
}

export default function CollectionTabEditor({
    items,
    onSave,
    saving,
    title,
    addLabel,
    emptyMessage,
    fields,
    columns,
    formLayout,
    sortFields = [],
    getMobileImage,
    getMobileIcon,
}) {
    const [records, setRecords] = useState(() => Array.isArray(items) ? items : []);
    const [activeView, setActiveView] = useState("list");
    const [editIndex, setEditIndex] = useState(null);
    const [formData, setFormData] = useState({});
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
        searchValue: "",
        sortKey: "sno",
        sortOrder: "1",
    });

    const listColumns = columns || fields.filter((field) => field.name !== "sno");
    const matchedRecords = useMemo(() => {
        const search = query.searchValue.trim().toLowerCase();
        return records
            .map((record, index) => ({ record, index }))
            .filter(({ record, index }) => {
                if (!search) return true;
                const formRecord = Object.fromEntries(fields.map((field) => [
                    field.name,
                    field.name === "sno" ? index + 1 : record[field.storageKey || field.name],
                ]));
                return [String(index + 1), ...fields.map((field) => String(formRecord?.[field.name] ?? ""))]
                    .some((value) => value.toLowerCase().includes(search));
            })
            .sort((left, right) => {
                const direction = query.sortOrder === "-1" ? -1 : 1;
                if (query.sortKey === "sno") return direction * (left.index - right.index);
                const sortField = sortFields.find((field) => field.name === query.sortKey);
                if (!sortField) return 0;
                return direction * String(sortField.getValue(left.record) ?? "").localeCompare(
                    String(sortField.getValue(right.record) ?? ""),
                    undefined,
                    { numeric: true },
                );
            });
    }, [fields, query.searchValue, query.sortKey, query.sortOrder, records, sortFields]);

    const extra = {
        page: query.page,
        limit: query.limit,
        totalData: matchedRecords.length,
        totalFilteredData: matchedRecords.length,
        totalPages: Math.max(1, Math.ceil(matchedRecords.length / query.limit)),
    };
    const pageRecords = matchedRecords.slice((query.page - 1) * query.limit, query.page * query.limit);

    function beginAdd() {
        setEditIndex(null);
        setFormData(Object.fromEntries(fields.map((field) => [field.name, field.initialValue ?? ""])));
        setActiveView("add");
    }

    function beginEdit(index) {
        const record = records[index];
        setEditIndex(index);
        setFormData(Object.fromEntries(fields.map((field) => [
            field.name,
            field.name === "sno" ? index + 1 : record[field.storageKey || field.name],
        ])));
        setActiveView("edit");
    }

    function persist(nextRecords, onSuccess) {
        onSave(nextRecords, onSuccess);
    }

    function submitForm(event) {
        event.preventDefault();
        const existingRecord = editIndex === null ? {} : records[editIndex];
        const updatedRecord = fields.reduce((record, field) => {
            if (field.name !== "sno") record[field.storageKey || field.name] = formData[field.name];
            return record;
        }, { ...existingRecord });
        const nextRecords = editIndex === null
            ? [...records, updatedRecord]
            : records.map((record, index) => index === editIndex ? updatedRecord : record);

        const selectedIndex = editIndex ?? nextRecords.length - 1;
        const requestedPosition = formData.sno === "" ? nextRecords.length - 1 : Number(formData.sno) - 1;
        if (Number.isFinite(requestedPosition)) {
            const [selectedRecord] = nextRecords.splice(selectedIndex, 1);
            nextRecords.splice(Math.max(0, Math.min(requestedPosition, nextRecords.length)), 0, selectedRecord);
        }

        persist(nextRecords, () => {
            setRecords(nextRecords);
            setActiveView("list");
            setEditIndex(null);
            window.scrollTo(0, 0);
        });
    }

    function confirmDelete() {
        const nextRecords = records.filter((_, index) => index !== deleteIndex);
        persist(nextRecords, () => {
            setRecords(nextRecords);
            setDeleteIndex(null);
            setQuery((previous) => ({ ...previous, page: Math.min(previous.page, Math.max(1, Math.ceil(nextRecords.length / previous.limit))) }));
        });
    }

    function renderCell(column, record, index) {
        if (column.name === "sno") return <SerialNumber value={index + 1} />;
        const value = column.getValue ? column.getValue(record) : record[column.storageKey || column.name];
        return column.render ? column.render(record, value) : (value || "N/A");
    }

    function renderActions(index) {
        return (
            <div className="grid w-fit grid-cols-2 gap-2 mx-auto">
                <button onClick={() => beginEdit(index)} className="flex cursor-pointer items-center justify-center border-2 border-purple-800 p-1 text-lg text-purple-800 hover:bg-purple-200" title="Edit">
                    <FaEdit />
                </button>
                <button title="Delete" onClick={() => setDeleteIndex(index)} className="flex cursor-pointer items-center justify-center border-2 border-red-800 p-1 text-lg text-red-800 hover:bg-red-200">
                    <RiDeleteBin7Line />
                </button>
            </div>
        );
    }

    if (activeView !== "list") {
        const fieldMap = new Map(fields.map((field) => [field.name, field]));
        const layout = formLayout || [fields.map((field) => field.name)];
        return (
            <section>
                <form onSubmit={submitForm}>
                    {layout.map((group, index) => {
                        const names = Array.isArray(group) ? group : group.fields;
                        const className = Array.isArray(group)
                            ? "grid grid-cols-1 gap-4 mb-4"
                            : group.className || "";
                        const content = names.map((name) => (
                            <Field key={name} field={fieldMap.get(name)} value={formData[name]} setFormData={setFormData} />
                        ));
                        return Array.isArray(group)
                            ? <div key={index} className={`${className} md:grid-cols-2`}>{content}</div>
                            : <div key={index} className={className}>{content}</div>;
                    })}
                    <div className={title === "Offer" ? "mt-6 flex gap-3" : "mt-8 flex gap-3"}>
                        <button type="button" onClick={() => setActiveView("list")} className="cursor-pointer rounded-md border border-gray-200 px-5 py-2.5 text-gray-700 transition-colors hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60">
                            {saving ? (activeView === "add" ? "Adding..." : "Updating...") : `${activeView === "add" ? "Add" : "Update"} ${title}`}
                        </button>
                    </div>
                </form>
            </section>
        );
    }

    return (
        <>
            <section>
                <div className="mb-10 grid grid-cols-12 gap-4">
                    <div className="col-span-12 sm:col-span-8 md:col-span-9 xl:col-span-10">
                        <input
                            type="text"
                            placeholder="Search here..."
                            value={query.searchValue}
                            onChange={(event) => setQuery((previous) => ({ ...previous, searchValue: event.target.value, page: 1 }))}
                            className="form-input"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-4 md:col-span-3 xl:col-span-2">
                        <button onClick={beginAdd} className="flex w-full cursor-pointer items-center justify-center rounded-md bg-primary px-6 py-2.5 text-white transition-opacity duration-200 hover:opacity-90 xl:text-base">
                            <span className="flex items-center justify-center gap-1"><MdAdd /><span>{addLabel}</span></span>
                        </button>
                    </div>
                </div>

                {!saving && pageRecords.length === 0 ? <NoDataComponent message={emptyMessage} /> : null}

                {!saving && pageRecords.length > 0 && (
                    <>
                        <div className="hidden lg:block">
                            <table className="mb-5 w-full border-collapse text-left">
                                <thead className="bg-gray-200 text-sm uppercase">
                                    <tr>
                                        {listColumns.map((column) => (
                                            <th key={column.name} className={`px-4 py-2 ${column.name === "sno" ? "w-5" : ""}`}>
                                                {column.name === "sno" || sortFields.some((field) => field.name === column.name)
                                                    ? <div className="flex justify-center"><SerialSortButton query={query} setQuery={setQuery} sortKey={column.name} >{column.label}</SerialSortButton></div>
                                                    : column.label}
                                            </th>
                                        ))}
                                        <th className="px-4 py-2 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {pageRecords.map(({ record, index }) => (
                                        <tr key={record._id || index} className="border-b-1 border-gray-400 transition-colors duration-200 hover:bg-gray-50">
                                            {listColumns.map((column) => (
                                                <td key={column.name} className={`px-4 py-3 ${column.name === "sno" ? `text-center ${query.sortKey === "sno" ? "bg-gray-100" : ""}` : ""} ${column.center ? "text-center" : ""}`}>
                                                    {renderCell(column, record, index)}
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 align-middle text-center">{renderActions(index)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-1 gap-5 lg:hidden sm:grid-cols-2">
                            {pageRecords.map(({ record, index }) => (
                                <div key={record._id || index} className="flex flex-col justify-between rounded-md border border-gray-300 p-5">
                                    <div>
                                        {getMobileImage?.(record) && <img src={getMobileImage(record)} alt={record.title || record.label || title} className="mb-4 h-auto w-full rounded-md" />}
                                        <h2 className="text-xl font-semibold">S.N: <SerialNumber value={index + 1} /></h2>
                                        {getMobileIcon && (
                                            <div className="mb-4 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-4">
                                                {getMobileIcon(record)}
                                            </div>
                                        )}
                                        {listColumns.filter((column) => column.name !== "sno" && !(getMobileIcon && column.name === "icon")).map((column) => (
                                            <p key={column.name} className="text-gray-600">
                                                <span className="font-semibold text-black">{column.label}:</span> {renderCell(column, record, index)}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="mt-4 flex gap-2">{renderActions(index)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {pageRecords.length > 0 && (
                    <PaginationSection query={query} setQuery={setQuery} extra={extra} loading={saving} />
                )}
            </section>

            <ConfirmationPopup
                show={deleteIndex !== null}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteIndex(null)}
                title="Confirm Deletion"
                message={`Are you sure you want to delete this ${title.toLowerCase()}?`}
                loading={saving}
                confirmText="Yes, Delete"
                loadingText="Deleting..."
            />
        </>
    );
}
