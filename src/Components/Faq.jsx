import React, { useEffect, useState } from 'react';
import { createFaq, getFaqs, editFaq, deleteFaq } from '../service/FaqService';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Faq() {
    const [faqs, setFaqs] = useState([]);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const navigate = useNavigate();

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const res = await getFaqs();
            setFaqs(res?.data?.data || []);
            toast.success("FAQ savollar muvaffaqiyatli yuklandi", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error('FAQ savollarni olishda xato:', error);
            toast.error("FAQ savollarni yuklashda xato yuz berdi", {
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
            const faqData = {
                question_en: data.question_en?.trim() || '',
                question_ru: data.question_ru?.trim() || '',
                question_de: data.question_de?.trim() || '',
                answer_en: data.answer_en?.trim() || '',
                answer_ru: data.answer_ru?.trim() || '',
                answer_de: data.answer_de?.trim() || '',
            };

            if (!faqData.question_en || !faqData.question_ru || !faqData.question_de ||
                !faqData.answer_en || !faqData.answer_ru || !faqData.answer_de) {
                throw new Error("Barcha maydonlar to'ldirilishi kerak!");
            }

            if (modalType === 'add') {
                await createFaq(faqData);
                toast.success("Yangi FAQ muvaffaqiyatli qo‘shildi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else if (modalType === 'edit' && selectedFaq) {
                await editFaq(selectedFaq.id, faqData);
                toast.success("FAQ muvaffaqiyatli tahrirlandi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            reset();
            setModal(false);
            setModalType('add');
            setSelectedFaq(null);
            fetchFaqs();
        } catch (error) {
            console.error('FAQ bilan ishlashda xato:', error);
            toast.error(modalType === 'add' ? "Qo‘shishda xato yuz berdi" : "Tahrirlashda xato yuz berdi", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (faq) => {
        setModalType('edit');
        setSelectedFaq(faq);
        setValue('question_en', faq.question_en);
        setValue('question_ru', faq.question_ru);
        setValue('question_de', faq.question_de);
        setValue('answer_en', faq.answer_en);
        setValue('answer_ru', faq.answer_ru);
        setValue('answer_de', faq.answer_de);
        setModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu FAQni o‘chirishni tasdiqlaysizmi?')) {
            setLoading(true);
            try {
                const res = await deleteFaq(id);
                fetchFaqs();
                if (res.success !== false) {
                    toast.success("FAQ muvaffaqiyatli o‘chirildi", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error('FAQni o‘chirishda xato:', error);
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
        fetchFaqs();
    }, []);

    return (
        <>
            <section className="p-5">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold">FAQ</h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                setModalType('add');
                                setSelectedFaq(null);
                                reset();
                                setModal(true);
                            }}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            FAQ qo‘shish
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
                                    <th className="py-2 px-4 border-b text-left">Savol (En)</th>
                                    <th className="py-2 px-4 border-b text-left">Savol (Ru)</th>
                                    <th className="py-2 px-4 border-b text-left">Savol (De)</th>
                                    <th className="py-2 px-4 border-b text-left">Javob (En)</th>
                                    <th className="py-2 px-4 border-b text-left">Javob (Ru)</th>
                                    <th className="py-2 px-4 border-b text-left">Javob (De)</th>
                                    <th className="py-2 px-4 border-b text-center">Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faqs.map((faq, index) => (
                                    <tr key={faq?.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{faq?.question_en}</td>
                                        <td className="py-2 px-4 border-b">{faq?.question_ru}</td>
                                        <td className="py-2 px-4 border-b">{faq?.question_de}</td>
                                        <td className="py-2 px-4 border-b">{faq?.answer_en}</td>
                                        <td className="py-2 px-4 border-b">{faq?.answer_ru}</td>
                                        <td className="py-2 px-4 border-b">{faq?.answer_de}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <button
                                                onClick={() => handleEdit(faq)}
                                                className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                            >
                                                Tahrirlash
                                            </button>
                                            <button
                                                onClick={() => handleDelete(faq.id)}
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
                            {modalType === 'add' ? 'Yangi FAQ qo‘shish' : 'FAQni tahrirlash'}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Savol (En) (masalan: What is your return policy?)"
                                    {...register('question_en', {
                                        required: "Savol (En) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Savol (En) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.question_en && (
                                    <p className="text-red-500 text-sm mt-1">{errors.question_en.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Savol (Ru) (masalan: Какова ваша политика возврата?)"
                                    {...register('question_ru', {
                                        required: "Savol (Ru) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Savol (Ru) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.question_ru && (
                                    <p className="text-red-500 text-sm mt-1">{errors.question_ru.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Savol (De) (masalan: Was ist Ihre Rückgaberechtsrichtlinie?)"
                                    {...register('question_de', {
                                        required: "Savol (De) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Savol (De) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.question_de && (
                                    <p className="text-red-500 text-sm mt-1">{errors.question_de.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Javob (En) (masalan: You can return items within 30 days.)"
                                    {...register('answer_en', {
                                        required: "Javob (En) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Javob (En) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.answer_en && (
                                    <p className="text-red-500 text-sm mt-1">{errors.answer_en.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Javob (Ru) (masalan: Вы можете вернуть товар в течение 30 дней.)"
                                    {...register('answer_ru', {
                                        required: "Javob (Ru) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Javob (Ru) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.answer_ru && (
                                    <p className="text-red-500 text-sm mt-1">{errors.answer_ru.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Javob (De) (masalan: Sie können Artikel innerhalb von 30 Tagen zurücksenden.)"
                                    {...register('answer_de', {
                                        required: "Javob (De) maydoni to'ldirilishi kerak!",
                                        validate: (value) =>
                                            (typeof value === 'string' && value.trim() !== '') || "Javob (De) bo'sh bo'lmasligi kerak!",
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.answer_de && (
                                    <p className="text-red-500 text-sm mt-1">{errors.answer_de.message}</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal(false);
                                        setModalType('add');
                                        setSelectedFaq(null);
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

export default Faq;