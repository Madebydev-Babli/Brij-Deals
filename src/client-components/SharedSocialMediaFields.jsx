"use client";

export default function SharedSocialMediaFields({ fields, value, onChange, saving, submitLabel }) {
    return (
        <div>
            <div className="mb-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                {fields.map((field) => (
                    <div key={field.name}>
                        <label htmlFor={field.name} className="form-label">{field.label}</label>
                        <input
                            id={field.name}
                            name={field.name}
                            type="text"
                            placeholder={field.placeholder}
                            value={value[field.name] ?? ""}
                            onChange={(event) => onChange(field.name, event.target.value)}
                            className="form-input"
                        />
                    </div>
                ))}
            </div>
            <div className="mt-8 flex gap-3">
                <button type="submit" disabled={saving} className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60">
                    {saving ? "Updating..." : submitLabel}
                </button>
            </div>
        </div>
    );
}
