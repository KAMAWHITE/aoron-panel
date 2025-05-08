import React, { useEffect, useState } from 'react';
import { createNews, getNews, editNews, deleteNews } from '../service/NewService';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function News() {
    const [newsItems, setNewsItems] = useState([]);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedNews, setSelectedNews] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const navigate = useNavigate();

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await getNews();
            setNewsItems(res?.data?.data || []);
            toast.success("Yangiliklar muvaffaqiyatli yuklandi", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Yangiliklarni olishda xato:', error);
            toast.error("Yangiliklarni yuklashda xato yuz berdi", {
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
            const newsData = {
                title_en: data.title_en?.trim() || '',
                title_ru: data.title_ru?.trim() || '',
                title_de: data.title_de?.trim() || '',
                description_en: data.description_en?.trim() || '',
                description_ru: data.description_ru?.trim() || '',
                description_de: data.description_de?.trim() || '',
            };

            if (!newsData.title_en || !newsData.title_ru || !newsData.title_de ||
                !newsData.description_en || !newsData.description_ru || !newsData.description_de) {
                throw new Error("Barcha maydonlar to'ldirilishi kerak!");
            }

            if (modalType === 'add') {
                await createNews(newsData);
                toast.success("Yangi yangilik muvaffaqiyatli qo‘shildi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else if (modalType === 'edit' && selectedNews) {
                await editNews(selectedNews.id, newsData);
                toast.success("Yangilik muvaffaqiyatli tahrirlandi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            reset();
            setModal(false);
            setModalType('add');
            setSelectedNews(null);
            fetchNews();
        } catch (error) {
            console.error('Yangilik bilan ishlashda xato:', error);
            toast.error(modalType === 'add' ? "Qo‘shishda xato yuz berdi" : "Tahrirlashda xato yuz berdi", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (newsItem) => {
        setModalType('edit');
        setSelectedNews(newsItem);
        setValue('title_en', newsItem.title_en);
        setValue('title_ru', newsItem.title_ru);
        setValue('title_de', newsItem.title_de);
        setValue('description_en', newsItem.description_en);
        setValue('description_ru', newsItem.description_ru);
        setValue('description_de', newsItem.description_de);
        setModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu yangilikni o‘chirishni tasdiqlaysizmi?')) {
            setLoading(true);
            try {
                const res = await deleteNews(id);
                fetchNews();
                if (res.success !== false) {
                    toast.success("Yangilik muvaffaqiyatli o‘chirildi", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error('Yangilikni o‘chirishda xato:', error);
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
        fetchNews();
    }, []);

    return (
        <>
            <section className="p-5">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold">Yangiliklar</h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                setModalType('add');
                                setSelectedNews(null);
                                reset();
                                setModal(true);
                            }}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Yangilik qo‘shish
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
                                    <th className="py-2 px-4 border-b text-left">Sarlavha (En)</th>
                                    <th className="py-2 px-4 border-b text-left">Sarlavha (Ru)</th>
                                    <th className="py-2 px-4 border-b text-left">Sarlavha (De)</th>
                                    <th className="py-2 px-4 border-b text-left">Tavsif (En)</th>
                                    <th className="py-2 px-4 border-b text-left">Tavsif (Ru)</th>
                                    <th className="py-2 px-4 border-b text-left">Tavsif (De)</th>
                                    <th className="py-2 px-4 border-b text-center">Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newsItems.map((newsItem, index) => (
                                    <tr key={newsItem?.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{newsItem?.title_en}</td>
                                        <td className="py-2 px-4 border-b">{newsItem?.title_ru}</td>
                                        <td className="py-2 px-4 border-b">{newsItem?.title_de}</td>
                                        <td className="py-2 px-4 border-b">{newsItem?.description_en}</td>
                                        <td className="py-2 px-4 border-b">{newsItem?.description_ru}</td>
                                        <td className="py-2 px-4 border-b">{newsItem?.description_de}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <button
                                                onClick={() => handleEdit(newsItem)}
                                                className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                            >
                                                Tahrirlash
                                            </button>
                                            <button
                                                onClick={() => handleDelete(newsItem.id)}
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
                            {modalType === 'add' ? 'Yangi yangilik qo‘shish' : 'Yangilikni tahrirlash'}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Sarlavha (En) (masalan: New Product Launch)"
                                    {...register('title_en', {
                                        required: "Sarlavha (En) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Sarlavha (En) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.title_en && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title_en.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Sarlavha (Ru) (masalan: Запуск нового продукта)"
                                    {...register('title_ru', {
                                        required: "Sarlavha (Ru) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Sarlavha (Ru) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.title_ru && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title_ru.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Sarlavha (De) (masalan: Neue Produktveröffentlichung)"
                                    {...register('title_de', {
                                        required: "Sarlavha (De) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Sarlavha (De) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.title_de && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title_de.message}</p>
                                )}
                            </div>
                            <div>
                                <textarea
                                    placeholder="Tavsif (En) (masalan: We are excited to announce the launch of our new product.)"
                                    {...register('description_en', {
                                        required: "Tavsif (En) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Tavsif (En) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                />
                                {errors.description_en && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description_en.message}</p>
                                )}
                            </div>
                            <div>
                                <textarea
                                    placeholder="Tavsif (Ru) (masalan: Мы рады объявить о запуске нашего нового продукта.)"
                                    {...register('description_ru', {
                                        required: "Tavsif (Ru) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Tavsif (Ru) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                />
                                {errors.description_ru && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description_ru.message}</p>
                                )}
                            </div>
                            <div>
                                <textarea
                                    placeholder="Tavsif (De) (masalan: Wir freuen uns, die Einführung unseres neuen Produkts anzukündigen.)"
                                    {...register('description_de', {
                                        required: "Tavsif (De) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Tavsif (De) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                />
                                {errors.description_de && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description_de.message}</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal(false);
                                        setModalType('add');
                                        setSelectedNews(null);
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

export default News;