import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="w-56 h-screen bg-gray-800 text-white flex flex-col items-center p-5">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">ARON</h1>
            </div>
            <ul className="space-y-2 w-full">
                <li>
                    <NavLink
                        to="/category"
                        className={({ isActive }) =>
                            isActive
                                ? "block px-3 py-2 text-center bg-green-600 rounded"
                                : "block px-3 py-2 text-center hover:bg-gray-700 rounded"
                        }
                    >
                        Category
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/discount"
                        className={({ isActive }) =>
                            isActive
                                ? "block px-3 py-2 text-center bg-green-600 rounded"
                                : "block px-3 py-2 text-center hover:bg-gray-700 rounded"
                        }
                    >
                        Discount
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/sizes"
                        className={({ isActive }) =>
                            isActive
                                ? "block px-3 py-2 text-center bg-green-600 rounded"
                                : "block px-3 py-2 text-center hover:bg-gray-700 rounded"
                        }
                    >
                        Sizes
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/colors"
                        className={({ isActive }) =>
                            isActive
                                ? "block px-3 py-2 text-center bg-green-600 rounded"
                                : "block px-3 py-2 text-center hover:bg-gray-700 rounded"
                        }
                    >
                        Colors
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/faq"
                        className={({ isActive }) =>
                            isActive
                                ? "block px-3 py-2 text-center bg-green-600 rounded"
                                : "block px-3 py-2 text-center hover:bg-gray-700 rounded"
                        }
                    >
                        FAQ
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            isActive
                                ? "block px-3 py-2 text-center bg-green-600 rounded"
                                : "block px-3 py-2 text-center hover:bg-gray-700 rounded"
                        }
                    >
                        Contact
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/team"
                        className={({ isActive }) =>
                            isActive
                                ? "block px-3 py-2 text-center bg-green-600 rounded"
                                : "block px-3 py-2 text-center hover:bg-gray-700 rounded"
                        }
                    >
                        Team
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/news"
                        className={({ isActive }) =>
                            isActive
                                ? "block px-3 py-2 text-center bg-green-600 rounded"
                                : "block px-3 py-2 text-center hover:bg-gray-700 rounded"
                        }
                    >
                        News
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;