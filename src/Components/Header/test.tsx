import React from 'react';

export default function test() {

    const sharedClasses = {
        flex: 'flex',
        itemsCenter: 'items-center',
        textZinc700: 'text-zinc-700',
        hoverTextPrimary: 'hover:text-primary',
        bgZinc200: 'bg-zinc-200',
        textZinc500: 'text-zinc-500',
        textPrimary: 'text-primary',
        bgPrimary: 'bg-primary',
        textWhite: 'text-white',
        roundedFull: 'rounded-full',
        spaceX4: 'space-x-4',
        relative: 'relative',
        focusOutlineNone: 'focus:outline-none',
        focusRing2: 'focus:ring-2',
        focusRingPrimary: 'focus:ring-primary',
        border: 'border',
        borderZinc300: 'border-zinc-300',
        py2: 'py-2',
        px4: 'px-4',
        pl10: 'pl-10',
        absolute: 'absolute',
        left3: 'left-3',
        top25: 'top-2.5',
        text2xl: 'text-2xl',
        textXl: 'text-xl',
        textSm: 'text-sm',
        textGreen700: 'text-green-700',
        bgGreen100: 'bg-green-100',
        py1: 'py-1',
        px3: 'px-3',
        roundedLg: 'rounded-lg',
        borderB: 'border-b',
        borderZinc200: 'border-zinc-200',
        textLeft: 'text-left',
        minWFull: 'min-w-full',
      }


    return (
        <>
            <div className="min-h-screen bg-zinc-100 p-4">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="flex">
                        <div className="w-1/4 bg-zinc-50 p-4">
                            <div className="flex items-center mb-6">
                                <img src="https://placehold.co/24x24?text=🌐" alt="Simply Web Logo" className="mr-2" />
                                <span className="text-xl font-semibold">Simply Web</span>
                            </div>
                            <nav>
                                <ul>
                                    <li className="mb-4">
                                        <a href="#" className="flex items-center text-zinc-700 hover:text-primary">
                                            <img src="https://placehold.co/24x24?text=🏠" alt="Dashboard Icon" className="mr-2" />
                                            Dashboard
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a href="#" className="flex items-center text-primary font-semibold">
                                            <img src="https://placehold.co/24x24?text=🎫" alt="Tickets Icon" className="mr-2" />
                                            Tickets
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a href="#" className="flex items-center text-zinc-700 hover:text-primary">
                                            <img src="https://placehold.co/24x24?text=👥" alt="Customers Icon" className="mr-2" />
                                            Customers
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a href="#" className="flex items-center text-zinc-700 hover:text-primary">
                                            <img src="https://placehold.co/24x24?text=📂" alt="Categories Icon" className="mr-2" />
                                            Categories
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a href="#" className="flex items-center text-zinc-700 hover:text-primary">
                                            <img src="https://placehold.co/24x24?text=⚙️" alt="Admin Icon" className="mr-2" />
                                            Admin
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a href="#" className="flex items-center text-zinc-700 hover:text-primary">
                                            <img src="https://placehold.co/24x24?text=📄" alt="Article Icon" className="mr-2" />
                                            Article
                                            <span className="ml-auto bg-zinc-200 text-zinc-700 text-sm rounded-full px-2 py-1">6</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className="w-3/4 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-semibold">Welcome Back</h1>
                                    <p className="text-zinc-500">Hello Mahfuzul, Good Morning!</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <input type="text" className="bg-zinc-100 border border-zinc-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Search" />
                                        <img src="https://placehold.co/24x24?text=🔍" alt="Search Icon" className="absolute left-3 top-2.5" />
                                    </div>
                                    <img src="https://placehold.co/24x24?text=💬" alt="Messages Icon" />
                                    <img src="https://placehold.co/24x24?text=🔔" alt="Notifications Icon" />
                                    <img src="https://placehold.co/24x24?text=👤" alt="User Profile Icon" className="rounded-full" />
                                </div>
                            </div>

                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <div className="flex justify-between items-center p-4 border-b border-zinc-200">
                                    <h2 className="text-xl font-semibold">Tickets</h2>
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center text-zinc-700 hover:text-primary">
                                            <img src="https://placehold.co/24x24?text=🔍" alt="Filters Icon" className="mr-2" />
                                            Filters
                                        </button>
                                        <button className="bg-primary text-white py-2 px-4 rounded-full flex items-center">
                                            <img src="https://placehold.co/24x24?text=➕" alt="New Ticket Icon" className="mr-2" />
                                            New Ticket
                                        </button>
                                    </div>
                                </div>
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b border-zinc-200 text-left">Created By</th>
                                            <th className="py-2 px-4 border-b border-zinc-200 text-left">Subject</th>
                                            <th className="py-2 px-4 border-b border-zinc-200 text-left">Assigned</th>
                                            <th className="py-2 px-4 border-b border-zinc-200 text-left">Status</th>
                                            <th className="py-2 px-4 border-b border-zinc-200 text-left">Privacy</th>
                                            <th className="py-2 px-4 border-b border-zinc-200 text-left">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="py-2 px-4 border-b border-zinc-200 flex items-center">
                                                <img src="https://placehold.co/24x24" alt="User Avatar" className="rounded-full mr-2" />
                                                <div>
                                                    <p className="font-semibold">Jhon Clavio</p>
                                                    <p className="text-zinc-500 text-sm">Product Designer</p>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 border-b border-zinc-200">Blog Writing</td>
                                            <td className="py-2 px-4 border-b border-zinc-200">Simply Web</td>
                                            <td className="py-2 px-4 border-b border-zinc-200">
                                                <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-sm">Open</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-zinc-200">
                                                <span className="text-red-500">Private</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-zinc-200">April 14, 2022 5:20 PM</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}