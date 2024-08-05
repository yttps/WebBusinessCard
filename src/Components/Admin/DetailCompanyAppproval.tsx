import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetDataCompanyById } from '@/Model/GetCompanyById';
import HeaderAdmin from '../Header/HeaderAdmin';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function DetailCompanyAppproval() {

    const { id: companyId } = useParams();
    const companyapi = useMemo(() => new CompanyApi(), []);
    const [companyById, setCompanyById] = useState<GetDataCompanyById | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const fetchData = useCallback(async () => {
        try {

            if (companyId) {

                setIsLoading(true);
                const resGetdataDetail = await companyapi.GetDataCompanyById(companyId);
                setCompanyById(resGetdataDetail);
                console.log("Fetched response:", resGetdataDetail);

            }
        } catch (error) {
            console.error('Error fetching company data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [companyapi, companyId]);

    const AcceptCompanyData = async (companyid: string) => {

        const deleteBtn = document.getElementById('deleteBtn') as HTMLButtonElement;
        const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;

        const result = await Swal.fire({
            title: 'อนุมัติข้อมูล?',
            text: 'ยืนยันเพื่อทำการอนุมัติข้อมูล!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        });

        try {

            if (result.isConfirmed) {

                deleteBtn.style.visibility = 'hidden';
                submitBtn.style.visibility = 'hidden';
                setLoading(true);

                const res = await companyapi.AcceptCompanyData(companyid);

                if (res == 200) {

                    setLoading(false);
                    const confirm = await Swal.fire({
                        title: 'Success!',
                        text: 'อนุมัติข้อมูลสำเร็จ!',
                        icon: 'success',
                    });

                    if (confirm) {
                        nav('/ApprovalCompany', { replace: true });
                    }
                }
                else {
                    deleteBtn.style.visibility = 'visible';
                    submitBtn.style.visibility = 'visible';
                    setLoading(false);
                    Swal.fire({
                        title: 'Error!',
                        text: 'เกิดข้อผิดพลาดในการอนุมัติข้อมูล!',
                        icon: 'error',
                    });
                    return;
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            deleteBtn.style.visibility = 'visible';
            submitBtn.style.visibility = 'visible';
            setLoading(false);
        }
    }

    const DeleteCompanyData = async () => {

        if (!companyById) return;


        const deleteBtn = document.getElementById('deleteBtn') as HTMLButtonElement;
        const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;

        try {

            const result = await Swal.fire({
                title: 'ลบข้อมูล?',
                text: 'ยืนยันเพื่อทำการลบข้อมูล!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ตกลง',
                cancelButtonText: 'ยกเลิก'
            });

            if (result.isConfirmed) {

                deleteBtn.style.visibility = 'hidden';
                submitBtn.style.visibility = 'hidden';
                setLoading(true);
                const response = await companyapi.DeleteCompany(companyById.id);

                if (response == 200) {

                    setLoading(false);
                    const res = await Swal.fire({
                        title: 'Success!',
                        text: 'ลบข้อมูลสำเร็จ!',
                        icon: 'success',
                    });

                    if (res) {
                        nav('/ListCompany', { replace: true });
                    }

                }
            } else {
                deleteBtn.style.visibility = 'visible';
                submitBtn.style.visibility = 'visible';
                setLoading(false);
            }
        } catch (error) {
            deleteBtn.style.visibility = 'visible';
            submitBtn.style.visibility = 'visible';
            setLoading(false);
            console.error('Error deleting general user:', error);
            await Swal.fire({
                title: 'Error!',
                text: 'เกิดข้อผิดพลาดในการลบข้อมูล!',
                icon: 'error',
            });
        } finally {
            deleteBtn.style.visibility = 'visible';
            submitBtn.style.visibility = 'visible';
            setLoading(false);
        }
    }

    useEffect(() => {

        fetchData();

    }, [fetchData]);


    if (isLoading) {
        return (
            <div>
                <HeaderAdmin />
                <br />
                <div className="bg-card p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
                    <div className="flex">
                        <div className="w-1/3 bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-center items-center">
                                <p className='pr-5'>Loading data</p>
                                <l-tail-chase
                                    size="30"
                                    speed="1.75"
                                    color="black"
                                ></l-tail-chase>
                            </div>
                        </div>

                        <div className="flex justify-center w-2/3 bg-gray-50 p-4 rounded-lg ml-4">
                            <p className='pr-5'>Loading data</p>
                            <l-tail-chase
                                size="30"
                                speed="1.75"
                                color="black"
                            ></l-tail-chase>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!companyById) {
        return (
            <div className="flex flex-column items-center relative overflow-x-auto shadow-md sm:rounded-lg">
                <img src="https://www.gokaidosports.in/Images/nodata.jpg" alt="" style={{ width: '50%' }} />
                <br />
                <p className='text-xl'>ไม่พบข้อมูลบริษัท</p>
                <br />
            </div>
        );
    }

    return (
        <>
            <div>
                <HeaderAdmin />
                <br />
                {companyById ? (
                    <div className="bg-card p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
                        <div className="flex">
                            <div className="w-1/3 bg-gray-50 p-4 rounded-lg">
                                <div className="flex flex-col items-center">
                                    <img src={companyById.logo} alt="Profile Picture" className="w-70 h-24 object-cover rounded-lg mb-5" />
                                    <h2 className="text-lg font-semibold mb-2">Profile</h2>
                                    <br />
                                    <div className="text-center">
                                        <p className="text-muted-foreground">ชื่อบริษัท:</p>
                                        <p>{companyById.name}</p>
                                        <br />
                                        <p className="text-muted-foreground">ประเภทธุรกิจ:</p>
                                        <p>{companyById.businessType}</p>
                                        <br />
                                        <p className="text-muted-foreground">เว็บไซต์:</p>
                                        <p>{companyById.website}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-2/3 bg-gray-50 p-4 rounded-lg ml-4">
                                <h2 className="text-lg font-semibold mb-4">รายละเอียดบริษัท</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-muted-foreground">ปีที่ก่อตั้ง:</p>
                                        <p>{companyById.yearFounded}</p>
                                        <br />
                                        <p className="text-muted-foreground">อีเมล:</p>
                                        <p>{companyById.email}</p>
                                        <br />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-[15rem]">
                                    <button id='deleteBtn' className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg" onClick={DeleteCompanyData}>ลบข้อมูล</button>
                                    &nbsp;
                                    <button id='submitBtn' className="bg-green-500 text-red-50 hover:bg-green-600 py-2 px-4 rounded-lg" onClick={() => AcceptCompanyData(companyById.id)}>อนุมัติบริษัท</button>
                                </div>
                                {loading ?
                                    <div className='flex justify-content-end'>
                                        <h1>กำลังตรวจสอบข้อมูล </h1>
                                        &nbsp;
                                        <l-tail-chase
                                            size="15"
                                            speed="1.75"
                                            color="black"
                                        ></l-tail-chase>
                                    </div>
                                    : <div>
                                    </div>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-column items-center relative overflow-x-auto shadow-md sm:rounded-lg">
                        <img src="https://www.gokaidosports.in/Images/nodata.jpg" alt="" style={{ width: '50%' }} />
                        <br />
                        <p className='text-xl'>ไม่พบข้อมูลบริษัท</p>
                        <br />
                    </div>
                )}
            </div>

        </>
    );


}