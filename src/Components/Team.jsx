import { useEffect, useState } from "react";
import { createTeam, deleteTeam, getTeam, updateTeam } from "../service/TeamService";
import { imageUrl } from "../service/Api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TeamMembers() {
    const [teams, setTeams] = useState([]);
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState(null);
    const [id, setId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const { register, handleSubmit, setValue, reset } = useForm();
    const navigate = useNavigate();

    const fetchMember = async () => {
        setLoading(true);
        try {
            const res = await getTeam();
            setTeams(res?.data);
            toast.success("Jamoa a'zolari muvaffaqiyatli yuklandi", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.log(error);
            toast.error("Jamoa a'zolarini yuklashda xato yuz berdi", {
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
            const formdata = new FormData();
            formdata.append("full_name", data?.full_name);
            formdata.append("position_de", data?.position_de);
            formdata.append("position_ru", data?.position_ru);
            formdata.append("position_en", data?.position_en);
            if (image) {
                formdata.append("file", image);
            }
            if (id) {
                await updateTeam(id, formdata);
                toast.success("Jamoa a'zosi muvaffaqiyatli tahrirlandi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                await createTeam(formdata);
                toast.success("Yangi jamoa a'zosi muvaffaqiyatli qo‘shildi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
            setModal(false);
            fetchMember();
        } catch (error) {
            console.log(error);
            toast.error(id ? "Tahrirlashda xato yuz berdi" : "Qo‘shishda xato yuz berdi", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setFormLoading(false);
        }
    };

    const TeamDelete = async (id) => {
        setLoading(true);
        try {
            const res = await deleteTeam(id);
            fetchMember();
            if (res.success) {
                toast.success("Jamoa a'zosi muvaffaqiyatli o‘chirildi", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("O‘chirishda xato yuz berdi", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const showEdit = (data) => {
        setId(data?.id);
        setValue("full_name", data?.full_name || "");
        setValue("position_de", data?.position_de || "");
        setValue("position_ru", data?.position_ru || "");
        setValue("position_en", data?.position_en || "");
        setImage(null);
        setModal(true);
    };

    const openModal = () => {
        setId(null);
        setValue("full_name", "");
        setValue("position_de", "");
        setValue("position_ru", "");
        setValue("position_en", "");
        setImage(null);
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
        reset();
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
        fetchMember();
    }, []);

    return (
        <>
            <section className="p-5">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold">Team Members</h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={openModal}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Qo‘shish
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
                                    <th className="py-2 px-4 border-b text-left">Rasm</th>
                                    <th className="py-2 px-4 border-b text-left">To‘liq ism</th>
                                    <th className="py-2 px-4 border-b text-left">Lavozim (DE)</th>
                                    <th className="py-2 px-4 border-b text-left">Lavozim (RU)</th>
                                    <th className="py-2 px-4 border-b text-left">Lavozim (EN)</th>
                                    <th className="py-2 px-4 border-b text-center">Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams &&
                                    teams?.map((member, index) => (
                                        <tr key={member?.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b">{index + 1}</td>
                                            <td className="py-2 px-4 border-b">
                                                <img
                                                    src={`${imageUrl}/${member?.image}`}
                                                    className="w-[100px] h-[100px] rounded object-cover"
                                                    alt={member?.full_name}
                                                />
                                            </td>
                                            <td className="py-2 px-4 border-b">{member?.full_name}</td>
                                            <td className="py-2 px-4 border-b">{member?.position_de}</td>
                                            <td className="py-2 px-4 border-b">{member?.position_ru}</td>
                                            <td className="py-2 px-4 border-b">{member?.position_en}</td>
                                            <td className="py-2 px-4 border-b text-center">
                                                <button
                                                    onClick={() => showEdit(member)}
                                                    className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => TeamDelete(member?.id)}
                                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
            {modal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg w-[400px]">
                        <h3 className="text-xl font-bold mb-4">
                            {id ? "Tahrirlash" : "Yangi a'zo qo‘shish"}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <input
                                type="text"
                                placeholder="To‘liq ism"
                                {...register("full_name")}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Lavozim (DE)"
                                {...register("position_de")}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Lavozim (RU)"
                                {...register("position_ru")}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Lavozim (EN)"
                                {...register("position_en")}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="w-full p-2 border rounded"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className={`p-2 text-white rounded flex items-center justify-center ${formLoading
                                        ? "bg-green-300 cursor-not-allowed"
                                        : "bg-green-500 hover:bg-green-600"
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

export default TeamMembers;