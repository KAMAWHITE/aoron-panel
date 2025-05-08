import { useForm } from "react-hook-form";
import { login } from "./service/LoginService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await login(data?.login, data?.password);
            if (response?.success) {
                const { access_token, refresh_token } = response.data; // response.data dan olamiz
                if (access_token && refresh_token) {
                    localStorage.setItem("token", access_token);
                    localStorage.setItem("refresh", refresh_token);
                    toast.success("Muvaffaqiyatli tizimga kirdingiz", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                    window.location.reload();
                    navigate("/");
                } else {
                    throw new Error("Tokenlar topilmadi");
                }
            } else {
                throw new Error("Login yoki parol xato");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Login yoki parolda xatolik", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">
                <h2 className="text-2xl font-bold mb-6 text-center">Tizimga kirish</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Login"
                            {...register("login", { required: "Login majburiy" })}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.login && (
                            <p className="text-red-500 text-sm mt-1">{errors.login.message}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Parol"
                            {...register("password", { required: "Parol majburiy" })}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-2 text-white rounded flex items-center justify-center ${loading
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        {loading ? (
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
                                Yuklanmoqda...
                            </>
                        ) : (
                            "Kirish"
                        )}
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;