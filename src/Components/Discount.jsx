import React, { useEffect, useState } from 'react';
import { createDiscount, getDiscount, editDiscount, deleteDiscount } from '../service/DiscountService';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Discount() {
    const [discounts, setDiscounts] = useState([]);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const navigate = useNavigate();

    const fetchDiscount = async () => {
        setLoading(true);
        try {
            const res = await getDiscount();
            setDiscounts(res?.data?.data || []);
            toast.success("Chegirmalar muvaffaqiyatli yuklandi", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Chegirmalarni olishda xato:', error);
            toast.error("Chegirmalarni yuklashda xato yuz berdi", {
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
            const discountData = {
                discount: parseInt(data.discount) || 0,
                started_at: data.started_at || '',
                finished_at: data.finished_at || '',
                status: data.status === 'true' || data.status === true,
            };

            if (!discountData.discount || !discountData.discount_at || !discountData.finished_at) {
                throw new Error("Barcha maydonlar to'ldirilishi kerak!");
            }

            if (modalType === 'add') {
                await createDiscount(discountData);
                toast.success("Yangi chegirma muvaffaqiyatli qo‘shildi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else if (modalType === 'edit' && selectedDiscount) {
                await editDiscount(selectedDiscount.id, discountData);
                toast.success("Chegirma muvaffaqiyatli tahrirlandi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            reset();
            setModal(false);
            setModalType('add');
            setSelectedDiscount(null);
            fetchDiscount();
        } catch (error) {
            console.error('Chegirma bilan ishlashda xato:', error);
            toast.error(modalType === 'add' ? "Qo‘shishda xato yuz berdi" : "Tahrirlashda xato yuz berdi", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (discount) => {
        setModalType('edit');
        setSelectedDiscount(discount);
        setValue('discount', discount.discount);
        setValue('discount_at', discount.discount_at);
        setValue('finished_at', discount.finished_at);
        setValue('status', discount.status);
        setModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu chegirmani o‘chirishni tasdiqlaysizmi?')) {
            setLoading(true);
            try {
                const res = await deleteDiscount(id);
                fetchDiscount();
                if (res.success !== false) {
                    toast.success("Chegirma muvaffaqiyatli o‘chirildi", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error('Chegirmani o‘chirishda xato:', error);
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
        fetchDiscount();
    }, []);

    return (
        <>
            <section className="p-5">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold">Chegirmalar</h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                setModalType('add');
                                setSelectedDiscount(null);
                                reset();
                                setModal(true);
                            }}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Chegirma qo‘shish
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
                                    <th className="py-2 px-4 border-b text-left">Chegirma (%)</th>
                                    <th className="py-2 px-4 border-b text-left">Boshlanish sanasi</th>
                                    <th className="py-2 px-4 border-b text-left">Tugash sanasi</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-center">Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {discounts.map((discount, index) => (
                                    <tr key={discount?.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{discount?.discount}%</td>
                                        <td className="py-2 px-4 border-b">{discount?.started_at}</td>
                                        <td className="py-2 px-4 border-b">{discount?.finished_at}</td>
                                        <td className="py-2 px-4 border-b">{discount?.status ? 'Faol' : 'Nofaol'}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <button
                                                onClick={() => handleEdit(discount)}
                                                className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                            >
                                                Tahrirlash
                                            </button>
                                            <button
                                                onClick={() => handleDelete(discount.id)}
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
                            {modalType === 'add' ? 'Yangi chegirma qo‘shish' : 'Chegirmani tahrirlash'}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <input
                                    type="number"
                                    placeholder="Chegirma (%)"
                                    {...register('discount', {
                                        required: "Chegirma maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'number' && value >= 0 && value <= 100) || "Chegirma 0 dan 100 gacha bo'lishi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.discount && (
                                    <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="date"
                                    {...register('discount_at', {
                                        required: "Boshlanish sanasi to'ldirilishi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.discount_at && (
                                    <p className="text-red-500 text-sm mt-1">{errors.discount_at.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="date"
                                    {...register('finished_at', {
                                        required: "Tugash sanasi to'ldirilishi kerak!",
                                        validate: (value, formValues) =>
                                            new Date(value) > new Date(formValues.discount_at) || "Tugash sanasi boshlanish sanasidan keyin bo'lishi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.finished_at && (
                                    <p className="text-red-500 text-sm mt-1">{errors.finished_at.message}</p>
                                )}
                            </div>
                            <div>
                                <select
                                    {...register('status', {
                                        required: "Status tanlanishi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Statusni tanlang</option>
                                    <option value="true">Faol</option>
                                    <option value="false">Nofaol</option>
                                </select>
                                {errors.status && (
                                    <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal(false);
                                        setModalType('add');
                                        setSelectedDiscount(null);
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

export default Discount;