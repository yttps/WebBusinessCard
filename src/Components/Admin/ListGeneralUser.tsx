import { useCallback, useEffect, useMemo, useState } from 'react'
import HeaderAdmin from '../Header/HeaderAdmin'
import { GeneralUserApi } from '@/ApiEndpoints/GeneralUserApi';
import { Row, Col } from 'react-bootstrap';
import { GetAllGeneralUser } from '@/Model/GetAllGeneralUser';
import { Link, NavLink } from 'react-router-dom';

function ListGeneralUser() {

    const [searchQuery, setSearchQuery] = useState('');
    const generalUserApi = useMemo(() => new GeneralUserApi(), []);
    const [isloading, setIsLoading] = useState(false);
    const [dataGeneralUsers, setDataGeneralUsers] = useState<GetAllGeneralUser[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;



    const fetchData = useCallback(async () => {
        try {

            setIsLoading(true);
            const response = await generalUserApi.GetAllGeneralUsers(); //get by generalusers not form company
            setDataGeneralUsers(response);

        } catch (error) {
            console.error('Error fetching general users:', error);
        } finally {
            setIsLoading(false);
        }
    }, [generalUserApi]);

    const filteredData = dataGeneralUsers.filter((generalUsers) =>
        generalUsers?.firstname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handleClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    console.log(dataGeneralUsers);

    if (isloading) {
        return (
            <>
                <div>
                    <HeaderAdmin />
                    <br />
                    <div>
                        <Row>
                            <Col xs={2} style={{ height: '100wh' }}>
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex justify-center pt-2">
                                    <div className='flex justify-content-center justify-content-around'>
                                        <p className='text-xxl'>Loading data</p>
                                        &nbsp;
                                        <l-tail-chase
                                            size="18"
                                            speed="1.75"
                                            color="black"
                                        ></l-tail-chase>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={10}>
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex justify-center pt-2">
                                    <div className='flex justify-content-center justify-content-around'>
                                        <p className='text-xxl'>Loading data</p>
                                        &nbsp;
                                        <l-tail-chase
                                            size="20"
                                            speed="1.75"
                                            color="black"
                                        ></l-tail-chase>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </>
        );
    }

    if (!dataGeneralUsers) {
        return (
            <>
                <HeaderAdmin />
                <br />
                <div className="flex flex-column items-center relative overflow-x-auto shadow-md sm:rounded-lg">
                    <img src="https://www.gokaidosports.in/Images/nodata.jpg" alt="" style={{ width: '50%' }} />
                    <br />
                    <p className='text-xl'>ไม่พบข้อมูลบุคคลทั่วไป</p>
                </div>
            </>
        );
    }

    return (
        <>
            <HeaderAdmin />
            <br />
            <div>
                <Row>
                    <Col xs={2} style={{ height: '100wh' }}>
                        <hr />
                        <div className="h-screen px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                            <ul className="space-y-2 font-medium">
                                <li>
                                    <Link to="/ListCompany" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap">ข้อมูลบริษัท</span>
                                    </Link>
                                </li>
                            </ul>

                        </div>
                    </Col>
                    <Col xs={10}>
                        <div className='container'>
                            <hr />
                            <br />
                            <p><b>รายชื่อบุคคลทั่วไป</b></p>
                            <br />
                            <hr />
                            <br />
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <div className="flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                                    <label htmlFor="table-search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="table-search"
                                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="ค้นหาจากชื่อ..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {currentItems.length > 0 ? (
                                    <><table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    ชื่อ
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    นามสกุล
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    อีเมล
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    เพศ
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    แก้ไขข้อมูล
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((item: GetAllGeneralUser, index: number) => (
                                                <tr
                                                    key={index}
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                >
                                                    <td className="px-6 py-4">{item.firstname}</td>
                                                    <td className="px-6 py-4">{item.lastname}</td>
                                                    <td className="px-6 py-4">{item.email}</td>
                                                    <td className="px-6 py-4">{item.gender}</td>
                                                    <td className="px-6 py-4">
                                                        {typeof window !== 'undefined' && (
                                                            <NavLink to={`/ListGeneralUser/${item.id}`}>
                                                                <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">แสดงข้อมูล</button>
                                                            </NavLink>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table><div>
                                            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                                                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                                    <li>
                                                        <button
                                                            onClick={() => handleClick(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                        >
                                                            Previous
                                                        </button>
                                                    </li>
                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <li key={i}>
                                                            <button
                                                                onClick={() => handleClick(i + 1)}
                                                                className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === i + 1 ? 'text-blue-600 border border-gray-300 bg-blue-50' : 'text-gray-500 bg-white border border-gray-300'} hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                                                            >
                                                                {i + 1}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li>
                                                        <button
                                                            onClick={() => handleClick(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                        >
                                                            Next
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                            <br />
                                        </div></>
                                ) : (
                                    <div className="flex flex-column items-center relative overflow-x-auto shadow-md sm:rounded-lg">
                                        <img src="https://www.gokaidosports.in/Images/nodata.jpg" alt="" style={{ width: '50%' }} />
                                        <br />
                                        <p className='text-xl'>ไม่พบข้อมูลบุคคลทั่วไป</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default ListGeneralUser