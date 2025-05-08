import React, { useEffect, useState } from 'react';
import { createContact, getContacts, editContact, deleteContact } from '../service/ContactService';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
    const [contacts, setContacts] = useState([]);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const navigate = useNavigate();

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await getContacts();
            setContacts(res?.data?.data || []);
            toast.success("Kontaktlar muvaffaqiyatli yuklandi", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Kontaktlarni olishda xato:', error);
            toast.error("Kontaktlarni yuklashda xato yuz berdi", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setFormLoading(true);
        try {
            const contactData = {
                phone_number: data.phone_number?.trim() || '',
                email: data.email?.trim() || '',
                address_en: data.address_en?.trim() || '',
                address_ru: data.address_ru?.trim() || '',
                address_de: data.address_de?.trim() || '',
            };

            if (!contactData.phone_number || !contactData.email || 
                !contactData.address_en || !contactData.address_ru || !contactData.address_de) {
                throw new Error("Barcha maydonlar to'ldirilishi kerak!");
            }

            if (!/^\+[\d]{1,4}\d{9,}$/.test(contactData.phone_number)) {
                throw new Error("Telefon raqami noto‘g‘ri formatda (masalan: +998901234567)!");
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
                throw new Error("Email noto‘g‘ri formatda!");
            }

            if (modalType === 'add') {
                await createContact(contactData);
                toast.success("Yangi kontakt muvaffaqiyatli qo‘shildi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else if (modalType === 'edit' && selectedContact) {
                await editContact(selectedContact.id, contactData);
                toast.success("Kontakt muvaffaqiyatli tahrirlandi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            reset();
            setModal(false);
            setModalType('add');
            setSelectedContact(null);
            fetchContacts();
        } catch (error) {
            console.error('Kontakt bilan ishlashda xato:', error);
            toast.error(modalType === 'add' ? "Qo‘shishda xato yuz berdi" : "Tahrirlashda xato yuz berdi", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (contact) => {
        setModalType('edit');
        setSelectedContact(contact);
        setValue('phone_number', contact.phone_number);
        setValue('email', contact.email);
        setValue('address_en', contact.address_en);
        setValue('address_ru', contact.address_ru);
        setValue('address_de', contact.address_de);
        setModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu kontaktni o‘chirishni tasdiqlaysizmi?')) {
            setLoading(true);
            try {
                const res = await deleteContact(id);
                fetchContacts();
                if (res.success !== false) {
                    toast.success("Kontakt muvaffaqiyatli o‘chirildi", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error('Kontaktni o‘chirishda xato:', error);
                toast.error("O‘chirishda xato yuz berdi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleLogout = () => {
        if (window.confirm("Tizimdan chiqishni xohlaysizmi?")) {
            localStorage.removeItem("token");
            navigate("/login");
            toast.info("Tizimdan muvaffaqiyatli chiqdingiz", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <>
            <section className="p-5">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold">Kontaktlar</h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                setModalType('add');
                                setSelectedContact(null);
                                reset();
                                setModal(true);
                            }}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Kontakt qo‘shish
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Chiqish
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <svg
                            className="animate-spin h-8 w-8 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                        <span className="ml-2 text-blue-500">Yuklanmoqda...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="py-2 px-4 border-b text-left">№</th>
                                    <th className="py-2 px-4 border-b text-left">Telefon raqami</th>
                                    <th className="py-2 px-4 border-b text-left">Email</th>
                                    <th className="py-2 px-4 border-b text-left">Manzil (En)</th>
                                    <th className="py-2 px-4 border-b text-left">Manzil (Ru)</th>
                                    <th className="py-2 px-4 border-b text-left">Manzil (De)</th>
                                    <th className="py-2 px-4 border-b text-center">Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((contact, index) => (
                                    <tr key={contact?.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{contact?.phone_number}</td>
                                        <td className="py-2 px-4 border-b">{contact?.email}</td>
                                        <td className="py-2 px-4 border-b">{contact?.address_en}</td>
                                        <td className="py-2 px-4 border-b">{contact?.address_ru}</td>
                                        <td className="py-2 px-4 border-b">{contact?.address_de}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <button
                                                onClick={() => handleEdit(contact)}
                                                className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                            >
                                                Tahrirlash
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact.id)}
                                                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                O‘chirish
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg w-[400px]">
                        <h3 className="text-xl font-bold mb-4">
                            {modalType === 'add' ? 'Yangi kontakt qo‘shish' : 'Kontaktni tahrirlash'}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Telefon raqami (masalan: +998907777777)"
                                    {...register('phone_number', {
                                        required: "Telefon raqami maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            /^\+[\d]{1,4}\d{9,}$/.test(value) || "Telefon raqami noto‘g‘ri formatda (masalan: +998901234567)!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.phone_number && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email (masalan: example@gmail.com)"
                                    {...register('email', {
                                        required: "Email maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Email noto‘g‘ri formatda!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Manzil (En) (masalan: 123 Main St, Some City, Some Country)"
                                    {...register('address_en', {
                                        required: "Manzil (En) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Manzil (En) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.address_en && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address_en.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Manzil (Ru) (masalan: 123 Main St, Some City, Some Country)"
                                    {...register('address_ru', {
                                        required: "Manzil (Ru) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Manzil (Ru) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.address_ru && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address_ru.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Manzil (De) (masalan: 123 Main St, Some City, Some Country)"
                                    {...register('address_de', {
                                        required: "Manzil (De) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Manzil (De) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.address_de && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address_de.message}</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal(false);
                                        setModalType('add');
                                        setSelectedContact(null);
                                        reset();
                                    }}
                                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className={`p-2 text-white rounded flex items-center justify-center ${
                                        formLoading ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                                    }`}
                                >
                                    {formLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 mr-2 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8H4z"
                                                ></path>
                                            </svg>
                                            Saqlanmoqda...
                                        </>
                                    ) : (
                                        "Saqlash"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </>
    );
}

export default Contact;