"use client";

import { useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { RiDeleteBin7Line } from "react-icons/ri";
import ConfirmationPopup from "@/server-components/ConfirmationPopup";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";
import PaginationSection from "@/server-components/PaginationSection";
import CollectionTabEditor from "@/client-components/CollectionTabEditor";
import SharedSocialMediaFields from "@/client-components/SharedSocialMediaFields";
import {
  RESTAURANT_AMENITIES_ENUM,
  TRAVEL_MODE_ENUM,
} from "@/utility/utility-data";
import { formatDateTime } from "@/utility/utility-function";

function imageUrlForGallery(image) {
  return typeof image === "string" ? image : image?.data || image?.url || "";
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  name,
  id = name,
}) {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value ?? ""}
        required={required}
        onChange={(event) =>
          name
            ? onChange(name, event.target.value)
            : onChange(event.target.value)
        }
        className="form-input"
      />
    </div>
  );
}

function ImageField({ label, image, onChange, id }) {
  const source =
    typeof image === "string" ? image : image?.data || image?.url || "";

  function handleChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onChange({ data: reader.result, name: file.name });
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleChange}
        className="form-input"
      />
      {source && (
        <img
          src={source}
          alt={`${label} preview`}
          className="mt-2 h-24 w-auto rounded-md object-cover"
        />
      )}
    </div>
  );
}

function RemoveButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Remove ${label}`}
      title={`Remove ${label}`}
      className="flex cursor-pointer items-center justify-center border-2 border-red-800 p-1 text-lg text-red-800 hover:bg-red-200"
    >
      <RiDeleteBin7Line />
    </button>
  );
}

function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center justify-center gap-1 rounded-md bg-primary px-4 py-2 text-white transition-opacity hover:opacity-90"
    >
      <MdAdd /> {children}
    </button>
  );
}

export function HotelSocialMediaTab({ hotel, onSave, saving }) {
  const fields = ["instagram", "facebook", "youtube", "website"];
  const [draft, setDraft] = useState(() =>
    Object.fromEntries(fields.map((field) => [field, hotel?.[field] || ""])),
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave(draft);
      }}
    >
      <SharedSocialMediaFields
        fields={fields.map((field) => ({
          name: field,
          label:
            field === "youtube"
              ? "YouTube"
              : field[0].toUpperCase() + field.slice(1),
          placeholder: `Enter the ${field === "instagram" ? "Instagram Username" : field === "facebook" ? "Facebook Username" : field === "youtube" ? "YouTube Channel" : "Website"}`,
        }))}
        value={draft}
        onChange={(field, value) =>
          setDraft((current) => ({ ...current, [field]: value }))
        }
        saving={saving}
        submitLabel="Save Social Media"
      />
    </form>
  );
}

export function HotelOffersTab({ hotel, onSave, saving }) {
  return (
    <CollectionTabEditor
      items={hotel?.offers}
      onSave={(offers, onSuccess) => onSave({ offers }, onSuccess)}
      saving={saving}
      title="Offer"
      addLabel="Add Offer"
      emptyMessage="No Offers Found"
      fields={[
        { name: "sno", label: "S.N." },
        {
          name: "endDate",
          label: "End Date",
          type: "date",
          placeholder: "Enter the end date",
        },
        { name: "title", label: "Title", placeholder: "Enter the hotel title" },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Enter the description",
        },
      ]}
      columns={[
        { name: "sno", label: "S.N." },
        { name: "title", label: "Title" },
        { name: "description", label: "Description" },
        {
          name: "endDate",
          label: "End Date",
          render: (offer) => formatDateTime(offer.endDate),
        },
      ]}
      getMobileImage={() => imageUrlForGallery(hotel?.logo)}
      sortFields={[{ name: "endDate", getValue: (offer) => offer.endDate }]}
      formLayout={[
        {
          fields: ["sno", "endDate"],
          className: "grid grid-cols-1 gap-4 mb-4 md:grid-cols-2",
        },
        { fields: ["title"], className: "mb-4" },
        { fields: ["description"], className: "mb-2" },
      ]}
    />
  );
}

export function HotelAmenitiesTab({ hotel, onSave, saving }) {
  const options = [
    ...RESTAURANT_AMENITIES_ENUM.map((amenity) => ({
      value: amenity.title,
      label: amenity.title,
    })),
    ...(Array.isArray(hotel?.amenities) ? hotel.amenities : [])
      .map((amenity) => amenity?.name)
      .filter(
        (name) =>
          name &&
          !RESTAURANT_AMENITIES_ENUM.some((amenity) => amenity.title === name),
      )
      .map((name) => ({ value: name, label: name })),
  ];

  return (
    <CollectionTabEditor
      items={hotel?.amenities}
      onSave={(amenities, onSuccess) => onSave({ amenities }, onSuccess)}
      saving={saving}
      title="Amenity"
      addLabel="Add Amenity"
      emptyMessage="No Amenities Found"
      fields={[
        { name: "sno", label: "S.N." },
        {
          name: "title",
          label: "Title",
          storageKey: "name",
          type: "select",
          placeholder: "Select Amenity",
          options,
        },
      ]}
      columns={[
        { name: "sno", label: "S.N." },
        {
          name: "icon",
          label: "Icon",
          render: (amenity) => {
            const matched = RESTAURANT_AMENITIES_ENUM.find(
              (item) =>
                item.title.toLowerCase() ===
                (amenity?.name || "").toLowerCase(),
            );
            const Icon = matched?.icon;
            return Icon ? (
              <Icon className="text-2xl text-primary" />
            ) : (
              <span className="text-gray-400">-</span>
            );
          },
        },
        { name: "title", label: "Title", getValue: (amenity) => amenity.name },
      ]}
      getMobileIcon={(amenity) => {
        const matched = RESTAURANT_AMENITIES_ENUM.find(
          (item) =>
            item.title.toLowerCase() === (amenity?.name || "").toLowerCase(),
        );
        const Icon = matched?.icon;
        return Icon ? (
          <Icon className="text-3xl text-primary" />
        ) : (
          <span className="text-gray-400">No Icon</span>
        );
      }}
      formLayout={[
        {
          fields: ["sno", "title"],
          className: "grid grid-cols-1 gap-4 mb-4 md:grid-cols-2",
        },
      ]}
    />
  );
}

export function HotelAttractionsTab({ hotel, onSave, saving }) {
  return (
    <CollectionTabEditor
      items={hotel?.attractions}
      onSave={(attractions, onSuccess) => onSave({ attractions }, onSuccess)}
      saving={saving}
      title="Attraction"
      addLabel="Add Attraction"
      emptyMessage="No Attractions Found"
      fields={[
        { name: "sno", label: "S.N." },
        { name: "title", label: "Title", placeholder: "Enter the title" },
        {
          name: "distance",
          label: "Distance",
          placeholder: "Enter the distance",
        },
        {
          name: "duration",
          label: "Duration",
          storageKey: "time",
          placeholder: "Enter the duration",
        },
        {
          name: "mode",
          label: "Mode",
          type: "select",
          placeholder: "Select Mode",
          options: TRAVEL_MODE_ENUM.map((mode) => ({
            value: mode,
            label: mode,
          })),
        },
      ]}
      columns={[
        { name: "sno", label: "S.N." },
        { name: "title", label: "Title" },
        { name: "distance", label: "Distance" },
        {
          name: "duration",
          label: "Duration",
          getValue: (attraction) => attraction.time,
        },
        { name: "mode", label: "Mode" },
      ]}
      formLayout={[
        {
          fields: ["sno", "title", "distance", "duration", "mode"],
          className: "grid grid-cols-1 gap-4 mb-4 md:grid-cols-2",
        },
      ]}
    />
  );
}

export function HotelGalleryTab({ hotel, onSave, saving }) {
  return (
    <CollectionTabEditor
      items={hotel?.gallery}
      onSave={(gallery, onSuccess) => onSave({ gallery }, onSuccess)}
      saving={saving}
      title="Image"
      addLabel="Add Image"
      emptyMessage="No Gallery Images Found"
      fields={[
        { name: "sno", label: "S.N." },
        {
          name: "title",
          label: "Title",
          storageKey: "label",
          placeholder: "Enter the title",
        },
        { name: "image", label: "Image", type: "image", storageKey: "image" },
      ]}
      columns={[
        { name: "sno", label: "S.N." },
        {
          name: "image",
          label: "Image",
          render: (item) =>
            imageUrlForGallery(item.image) && (
              <img
                src={imageUrlForGallery(item.image)}
                alt={item.label || "Hotel gallery image"}
                className="h-12 w-12 rounded-md object-cover"
              />
            ),
        },
        { name: "title", label: "Title", getValue: (item) => item.label },
      ]}
      formLayout={[
        {
          fields: ["sno", "title"],
          className: "grid grid-cols-1 gap-4 mb-4 md:grid-cols-2",
        },
        { fields: ["image"], className: "mb-4" },
      ]}
      getMobileImage={(item) => imageUrlForGallery(item.image)}
    />
  );
}

function emptyRoomCategory() {
  return {
    title: "",
    description: "",
    heroImage: "",
    price: "",
    size: "",
    bedType: "",
    bedQuantity: 1,
    guests: 1,
    amenities: [],
    gallery: [],
  };
}

export function HotelRoomCategoriesTab({ hotel, onSave, saving }) {
  const [rooms, setRooms] = useState(() =>
    Array.isArray(hotel?.roomCategories) ? hotel.roomCategories : [],
  );
  const [activeView, setActiveView] = useState("list");
  const [formData, setFormData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    searchValue: "",
    sortKey: "sno",
    sortOrder: "1",
  });

  const matchingRooms = useMemo(() => {
    const search = query.searchValue.trim().toLowerCase();
    return rooms
      .map((room, index) => ({ room, index }))
      .filter(
        ({ room, index }) =>
          !search ||
          [
            String(index + 1),
            room.title,
            room.description,
            room.size,
            room.bedType,
            room.price,
            ...(Array.isArray(room.amenities) ? room.amenities : []),
          ].some((value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(search),
          ),
      )
      .sort((left, right) => {
        if (query.sortKey !== "title") {
          const direction = query.sortOrder === "-1" ? -1 : 1;
          return direction * (left.index - right.index);
        }
        const result = String(left.room.title || "").localeCompare(
          String(right.room.title || ""),
        );
        return query.sortOrder === "-1" ? -result : result;
      });
  }, [query.searchValue, query.sortKey, query.sortOrder, rooms]);

  const extra = {
    page: query.page,
    limit: query.limit,
    totalData: matchingRooms.length,
    totalFilteredData: matchingRooms.length,
    totalPages: Math.max(1, Math.ceil(matchingRooms.length / query.limit)),
  };
  const pageRooms = matchingRooms.slice(
    (query.page - 1) * query.limit,
    query.page * query.limit,
  );
  const initialQuery = {
    page: 1,
    limit: 10,
    searchValue: "",
    sortKey: "sno",
    sortOrder: "1",
  };

  function updateDraft(key, value) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function beginAdd() {
    setEditIndex(null);
    setFormData(emptyRoomCategory());
    setActiveView("add");
  }

  function beginEdit(index) {
    const room = rooms[index];
    setEditIndex(index);
    setFormData({
      ...room,
      amenities: Array.isArray(room.amenities) ? [...room.amenities] : [],
      gallery: Array.isArray(room.gallery)
        ? room.gallery.map((item) => ({ ...item }))
        : [],
    });
    setActiveView("edit");
  }

  function saveRoom(event) {
    event.preventDefault();
    const nextRooms =
      editIndex === null
        ? [...rooms, formData]
        : rooms.map((room, index) =>
            index === editIndex ? { ...room, ...formData } : room,
          );

    onSave({ roomCategories: nextRooms }, () => {
      setRooms(nextRooms);
      setFormData(null);
      setEditIndex(null);
      setActiveView("list");
      setQuery(initialQuery);
      window.scrollTo(0, 0);
    });
  }

  function confirmDelete() {
    const nextRooms = rooms.filter((_, index) => index !== deleteIndex);
    onSave({ roomCategories: nextRooms }, () => {
      setRooms(nextRooms);
      setDeleteIndex(null);
      setQuery((current) => ({ ...current, page: 1 }));
    });
  }

  if (activeView !== "list") {
    return (
      <section>
        <form onSubmit={saveRoom}>
          <div className="mb-6">
            <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold">
              Room Details
            </h2>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                label="Title"
                required
                value={formData.title}
                onChange={updateDraft}
                name="title"
                id="room-title"
              />
              <TextField
                label="Price"
                value={formData.price}
                onChange={updateDraft}
                name="price"
                id="room-price"
              />
              <TextField
                label="Room Size"
                value={formData.size}
                onChange={updateDraft}
                name="size"
                id="room-size"
              />
              <TextField
                label="Bed Type"
                value={formData.bedType}
                onChange={updateDraft}
                name="bedType"
                id="room-bed-type"
              />
              <TextField
                label="Bed Quantity"
                type="number"
                value={formData.bedQuantity}
                onChange={updateDraft}
                name="bedQuantity"
                id="room-bed-quantity"
              />
              <TextField
                label="Guest Capacity"
                type="number"
                value={formData.guests}
                onChange={updateDraft}
                name="guests"
                id="room-guest-capacity"
              />
              <div className="md:col-span-2">
                <label htmlFor="room-description" className="form-label">
                  Description
                </label>
                <textarea
                  id="room-description"
                  name="description"
                  value={formData.description || ""}
                  onChange={(event) =>
                    updateDraft("description", event.target.value)
                  }
                  rows="3"
                  className="form-input"
                />
              </div>
              <ImageField
                label="Hero Image"
                image={formData.heroImage}
                onChange={(image) => updateDraft("heroImage", image)}
                id="room-hero-image"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold">Room Amenities</h2>
              <AddButton
                onClick={() =>
                  setFormData((current) => ({
                    ...current,
                    amenities: [...(current.amenities || []), ""],
                  }))
                }
              >
                Add Amenity
              </AddButton>
            </div>
            {(formData.amenities || []).map((amenity, amenityIndex) => (
              <div key={amenityIndex} className="mb-2 flex gap-2">
                <div className="flex-1">
                  <label
                    htmlFor={`room-amenity-${amenityIndex}`}
                    className="form-label"
                  >
                    Amenity
                  </label>
                  <input
                    id={`room-amenity-${amenityIndex}`}
                    name={`amenity-${amenityIndex}`}
                    value={amenity}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        amenities: current.amenities.map((item, index) =>
                          index === amenityIndex ? event.target.value : item,
                        ),
                      }))
                    }
                    className="form-input"
                  />
                </div>
                <RemoveButton
                  label="room amenity"
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      amenities: current.amenities.filter(
                        (_, index) => index !== amenityIndex,
                      ),
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold">Room Gallery</h2>
              <AddButton
                onClick={() =>
                  setFormData((current) => ({
                    ...current,
                    gallery: [
                      ...(current.gallery || []),
                      { image: null, label: "" },
                    ],
                  }))
                }
              >
                Add Image
              </AddButton>
            </div>
            {(formData.gallery || []).map((item, galleryIndex) => (
              <div
                key={item._id || galleryIndex}
                className="mb-3 grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_1fr_auto]"
              >
                <ImageField
                  label="Image"
                  image={item.image}
                  id={`room-gallery-image-${galleryIndex}`}
                  onChange={(image) =>
                    setFormData((current) => ({
                      ...current,
                      gallery: current.gallery.map((galleryItem, index) =>
                        index === galleryIndex
                          ? { ...galleryItem, image }
                          : galleryItem,
                      ),
                    }))
                  }
                />
                <TextField
                  label="Label"
                  value={item.label}
                  id={`room-gallery-label-${galleryIndex}`}
                  onChange={(label) =>
                    setFormData((current) => ({
                      ...current,
                      gallery: current.gallery.map((galleryItem, index) =>
                        index === galleryIndex
                          ? { ...galleryItem, label }
                          : galleryItem,
                      ),
                    }))
                  }
                />
                <RemoveButton
                  label="room gallery item"
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      gallery: current.gallery.filter(
                        (_, index) => index !== galleryIndex,
                      ),
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setFormData(null);
                setQuery(initialQuery);
                setActiveView("list");
              }}
              className="cursor-pointer rounded-md border border-gray-200 px-5 py-2.5 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving
                ? activeView === "add"
                  ? "Adding..."
                  : "Updating..."
                : `${activeView === "add" ? "Add" : "Update"} Room Category`}
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
              onChange={(event) =>
                setQuery((current) => ({
                  ...current,
                  searchValue: event.target.value,
                  page: 1,
                }))
              }
              className="form-input"
            />
          </div>
          <div className="col-span-12 sm:col-span-4 md:col-span-3 xl:col-span-2">
            <button
              disabled={saving}
              onClick={beginAdd}
              className="flex w-full cursor-pointer items-center justify-center rounded-md bg-primary px-6 py-2.5 text-white transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 xl:text-base"
            >
              <span className="flex items-center justify-center gap-1">
                <MdAdd />
                <span>Add Room Category</span>
              </span>
            </button>
          </div>
        </div>

        {saving ? (
          <LoadingComponent message="Saving Room Categories..." />
        ) : null}
        {!saving && pageRooms.length === 0 ? (
          <NoDataComponent message="No Room Categories Found" />
        ) : null}
        {!saving && pageRooms.length > 0 && (
          <>
            <div className="hidden lg:block">
              <table className="mb-5 w-full border-collapse text-left">
                <thead className="bg-gray-200 text-sm uppercase">
                  <tr>
                    <th className="w-5 px-4 py-2">
                      <button
                        className="flex cursor-pointer items-center gap-1"
                        onClick={() =>
                          setQuery((current) => ({
                            ...current,
                            sortKey: "sno",
                            sortOrder: current.sortOrder === "1" ? "-1" : "1",
                          }))
                        }
                        title="Sort by Serial Number"
                      >
                        <span>S.N.</span>
                        <span className="text-xs">
                          {query.sortOrder === "1" ? "▲" : "▼"}
                        </span>
                      </button>
                    </th>
                    <th className="px-4 py-2">
                      <button
                        className="flex cursor-pointer items-center gap-1"
                        onClick={() =>
                          setQuery((current) => ({
                            ...current,
                            sortKey: "title",
                            sortOrder:
                              current.sortKey === "title" &&
                              current.sortOrder === "-1"
                                ? "1"
                                : "-1",
                          }))
                        }
                        title="Sort by Room Category"
                      >
                        Room Category
                      </button>
                    </th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Room Size</th>
                    <th className="px-4 py-2">Bed Type</th>
                    <th className="px-4 py-2">Guests</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {pageRooms.map(({ room, index }) => (
                    <tr
                      key={room._id || index}
                      className="border-b-1 border-gray-400 transition-colors duration-200 hover:bg-gray-50"
                    >
                      <td
                        className={`px-4 py-3 text-center ${query.sortKey === "sno" ? "bg-gray-100" : ""}`}
                      >
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </td>
                      <td className="px-4 py-3">{room.title || "N/A"}</td>
                      <td className="px-4 py-3">{room.price || "N/A"}</td>
                      <td className="px-4 py-3">{room.size || "N/A"}</td>
                      <td className="px-4 py-3">{room.bedType || "N/A"}</td>
                      <td className="px-4 py-3">{room.guests || "N/A"}</td>
                      <td className="px-4 py-3 align-middle text-center">
                        <div className="mx-auto grid w-fit grid-cols-2 gap-2">
                          <button
                            disabled={saving}
                            onClick={() => beginEdit(index)}
                            className="flex cursor-pointer items-center justify-center border-2 border-purple-800 p-1 text-lg text-purple-800 hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            disabled={saving}
                            title="Delete"
                            onClick={() => setDeleteIndex(index)}
                            className="flex cursor-pointer items-center justify-center border-2 border-red-800 p-1 text-lg text-red-800 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <RiDeleteBin7Line />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:hidden">
              {pageRooms.map(({ room, index }) => (
                <article
                  key={room._id || index}
                  className="flex flex-col justify-between rounded-md border border-gray-300 p-5"
                >
                  <div>
                    {imageUrlForGallery(room.heroImage) && (
                      <img
                        src={imageUrlForGallery(room.heroImage)}
                        alt={room.title || "Room category"}
                        className="mb-4 h-40 w-full rounded-md object-cover"
                      />
                    )}
                    <h2 className="text-xl font-semibold">
                      S.N: {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </h2>
                    <p className="text-gray-600">
                      <span className="font-semibold text-black">
                        Room Category:
                      </span>{" "}
                      {room.title || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold text-black">Price:</span>{" "}
                      {room.price || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold text-black">
                        Room Size:
                      </span>{" "}
                      {room.size || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold text-black">
                        Bed Type:
                      </span>{" "}
                      {room.bedType || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold text-black">Guests:</span>{" "}
                      {room.guests || "N/A"}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      disabled={saving}
                      onClick={() => beginEdit(index)}
                      className="flex cursor-pointer items-center justify-center border-2 border-purple-800 p-1 text-lg text-purple-800 hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      disabled={saving}
                      title="Delete"
                      onClick={() => setDeleteIndex(index)}
                      className="flex cursor-pointer items-center justify-center border-2 border-red-800 p-1 text-lg text-red-800 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <RiDeleteBin7Line />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <PaginationSection
              query={query}
              setQuery={setQuery}
              extra={extra}
              loading={saving}
            />
          </>
        )}
      </section>
      <ConfirmationPopup
        show={deleteIndex !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteIndex(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this room category?"
        loading={saving}
        confirmText="Yes, Delete"
        loadingText="Deleting..."
      />
    </>
  );
}
