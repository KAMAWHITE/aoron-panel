import React, { useEffect, useState } from 'react';
import { createColor, getColors, editColor, deleteColor } from '../service/ColorService';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Color() {
    const [colors, setColors] = useState([]);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedColor, setSelectedColor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const navigate = useNavigate();

    const fetchColors = async () => {
        setLoading(true);
        try {
            const res = await getColors();
            setColors(res?.data?.data || []);
            toast.success("Ranglar muvaffaqiyatli yuklandi", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Ranglarni olishda xato:', error);
            toast.error("Ranglarni yuklashda xato yuz berdi", {
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
            const colorData = {
                color_en: data.color_en?.trim() || '',
                color_ru: data.color_ru?.trim() || '',
                color_de: data.color_de?.trim() || '',
            };

            if (!colorData.color_en || !colorData.color_ru || !colorData.color_de) {
                throw new Error("Barcha maydonlar to'ldirilishi kerak!");
            }

            if (modalType === 'add') {
                await createColor(colorData);
                toast.success("Yangi rang muvaffaqiyatli qo‘shildi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else if (modalType === 'edit' && selectedColor) {
                await editColor(selectedColor.id, colorData);
                toast.success("Rang muvaffaqiyatli tahrirlandi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            reset();
            setModal(false);
            setModalType('add');
            setSelectedColor(null);
            fetchColors();
        } catch (error) {
            console.error('Rang bilan ishlashda xato:', error);
            toast.error(modalType === 'add' ? "Qo‘shishda xato yuz berdi" : "Tahrirlashda xato yuz berdi", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (color) => {
        setModalType('edit');
        setSelectedColor(color);
        setValue('color_en', color.color_en);
        setValue('color_ru', color.color_ru);
        setValue('color_de', color.color_de);
        setModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu rangni o‘chirishni tasdiqlaysizmi?')) {
            setLoading(true);
            try {
                const res = await deleteColor(id);
                fetchColors();
                if (res.success !== false) {
                    toast.success("Rang muvaffaqiyatli o‘chirildi", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error('Rangni o‘chirishda xato:', error);
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
        fetchColors();
    }, []);

    return (
        <>
            <section className="p-5">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold">Ranglar</h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                setModalType('add');
                                setSelectedColor(null);
                                reset();
                                setModal(true);
                            }}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Rang qo‘shish
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
                                    <th className="py-2 px-4 border-b text-left">Rang (En)</th>
                                    <th className="py-2 px-4 border-b text-left">Rang (Ru)</th>
                                    <th className="py-2 px-4 border-b text-left">Rang (De)</th>
                                    <th className="py-2 px-4 border-b text-center">Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {colors.map((color, index) => (
                                    <tr key={color?.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{color?.color_en}</td>
                                        <td className="py-2 px-4 border-b">{color?.color_ru}</td>
                                        <td className="py-2 px-4 border-b">{color?.color_de}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <button
                                                onClick={() => handleEdit(color)}
                                                className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                            >
                                                Tahrirlash
                                            </button>
                                            <button
                                                onClick={() => handleDelete(color.id)}
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
                            {modalType === 'add' ? 'Yangi rang qo‘shish' : 'Rangni tahrirlash'}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Rang (En) (masalan: Black)"
                                    {...register('color_en', {
                                        required: "Rang (En) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Rang (En) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.color_en && (
                                    <p className="text-red-500 text-sm mt-1">{errors.color_en.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Rang (Ru) (masalan: Чёрный)"
                                    {...register('color_ru', {
                                        required: "Rang (Ru) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Rang (Ru) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.color_ru && (
                                    <p className="text-red-500 text-sm mt-1">{errors.color_ru.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Rang (De) (masalan: Schwarz)"
                                    {...register('color_de', {
                                        required: "Rang (De) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Rang (De) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.color_de && (
                                    <p className="text-red-500 text-sm mt-1">{errors.color_de.message}</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal(false);
                                        setModalType('add');
                                        setSelectedColor(null);
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

export default Color;