import React, { useEffect, useState } from 'react';
import { createCategory, getCategory, editCategory, deleteCategory } from '../service/CategoryService';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Category() {
    const [categories, setCategories] = useState([]);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const res = await getCategory();
            setCategories(res?.data?.data || []);
            toast.success("Kategoriyalar muvaffaqiyatli yuklandi", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Kategoriyalarni olishda xato:', error);
            toast.error("Kategoriyalarni yuklashda xato yuz berdi", {
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
            const categoryData = {
                name_en: data.name_en?.trim() || '',
                name_de: data.name_de?.trim() || '',
                name_ru: data.name_ru?.trim() || '',
            };

            if (!categoryData.name_en || !categoryData.name_de || !categoryData.name_ru) {
                throw new Error("Barcha maydonlar to'ldirilishi kerak!");
            }

            if (modalType === 'add') {
                await createCategory(categoryData);
                toast.success("Yangi kategoriya muvaffaqiyatli qo‘shildi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else if (modalType === 'edit' && selectedCategory) {
                await editCategory(selectedCategory.id, categoryData);
                toast.success("Kategoriya muvaffaqiyatli tahrirlandi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            reset();
            setModal(false);
            setModalType('add');
            setSelectedCategory(null);
            fetchCategory();
        } catch (error) {
            console.error('Kategoriya bilan ishlashda xato:', error);
            toast.error(modalType === 'add' ? "Qo‘shishda xato yuz berdi" : "Tahrirlashda xato yuz berdi", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (category) => {
        setModalType('edit');
        setSelectedCategory(category);
        setValue('name_en', category.name_en);
        setValue('name_de', category.name_de);
        setValue('name_ru', category.name_ru);
        setModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu kategoriyani o‘chirishni tasdiqlaysizmi?')) {
            setLoading(true);
            try {
                const res = await deleteCategory(id);
                fetchCategory();
                if (res.success !== false) {
                    toast.success("Kategoriya muvaffaqiyatli o‘chirildi", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error('Kategoriyani o‘chirishda xato:', error);
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
        fetchCategory();
    }, []);

    return (
        <>
            <section className="p-5">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold">Kategoriyalar</h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                setModalType('add');
                                setSelectedCategory(null);
                                reset();
                                setModal(true);
                            }}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Kategoriya qo‘shish
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
                                    <th className="py-2 px-4 border-b text-left">Nomi (En)</th>
                                    <th className="py-2 px-4 border-b text-left">Nomi (De)</th>
                                    <th className="py-2 px-4 border-b text-left">Nomi (Ru)</th>
                                    <th className="py-2 px-4 border-b text-center">Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category?.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{category?.name_en}</td>
                                        <td className="py-2 px-4 border-b">{category?.name_de}</td>
                                        <td className="py-2 px-4 border-b">{category?.name_ru}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                            >
                                                Tahrirlash
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
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
                            {modalType === 'add' ? 'Yangi kategoriya qo‘shish' : 'Kategoriyani tahrirlash'}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nomi (En)"
                                    {...register('name_en', {
                                        required: "Nomi (En) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Nomi (En) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.name_en && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name_en.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nomi (De)"
                                    {...register('name_de', {
                                        required: "Nomi (De) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Nomi (De) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.name_de && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name_de.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nomi (Ru)"
                                    {...register('name_ru', {
                                        required: "Nomi (Ru) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Nomi (Ru) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.name_ru && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name_ru.message}</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal(false);
                                        setModalType('add');
                                        setSelectedCategory(null);
                                        reset();
                                    }}
                                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className={`p-2 text-white rounded flex items-center justify-center ${formLoading ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
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

export default Category;