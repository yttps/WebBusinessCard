import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { GeneralUserApi } from '@/ApiEndpoints/GeneralUserApi';
import { GetDataGeneralUserById } from '@/Model/GetGeneralUserById';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../Header/HeaderAdmin';

export default function DetailGeneralUser() {

    const { id: generalUserId } = useParams();
    const generaluserapi = useMemo(() => new GeneralUserApi(), []);
    const [GeneralUserById, setGeneralUserById] = useState<GetDataGeneralUserById | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            if (generalUserId) {
                setIsLoading(true);
                const resGetdataDetail = await generaluserapi.GetDataGeneralUserById(generalUserId);
                setGeneralUserById(resGetdataDetail);

            }
        } catch (error) {
            console.error('Error fetching company data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [generaluserapi, generalUserId]);

    const DeleteGeneralUserData = async (): Promise<void> => {

        if (!GeneralUserById) return;

        const deleteBtn = document.getElementById('deleteBtn') as HTMLButtonElement;

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
                setLoading(true);
                const response = await generaluserapi.DeleteGeneralUser(GeneralUserById?.id); //bug origin

                if (response == 200) {
                    setLoading(false);
                    const res = await Swal.fire({
                        title: 'Success!',
                        text: 'ลบข้อมูลสำเร็จ!',
                        icon: 'success',
                    });

                    if (res) {
                        nav('/ListGeneralUser', { replace: true });
                    }

                }
            }
        } catch (error) {

            console.error('Error deleting general user:', error);
            await Swal.fire({
                title: 'Error!',
                text: 'เกิดข้อผิดพลาดในการลบข้อมูล!',
                icon: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

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

    if (!GeneralUserById) {
        return (
            <div className="flex flex-column items-center relative overflow-x-auto shadow-md sm:rounded-lg">
                <img src="https://www.gokaidosports.in/Images/nodata.jpg" alt="" style={{ width: '50%' }} />
                <br />
                <p className='text-xl'>ไม่พบข้อมูลบุคคลทั่วไป</p>
                <br />
            </div>
        );
    }

    return (
        <>
            <HeaderAdmin />
            <br />
            {GeneralUserById ? (
                <div className="bg-card p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
                    <div className="flex">
                        <div className="w-1/3 bg-gray-50 p-4 rounded-lg">
                            <div className="flex flex-col items-center">
                                <img src={GeneralUserById?.profile} alt="Profile Picture" className="w-70 h-24 object-cover rounded-lg mb-5" />
                                <h2 className="text-lg font-semibold mb-2">Profile</h2>
                                <br />
                                <div className="text-center">
                                    <p className="text-muted-foreground">ชื่อ:</p>
                                    <p>{GeneralUserById?.firstname}</p>
                                    <br />
                                    <p className="text-muted-foreground">นามสกุล:</p>
                                    <p>{GeneralUserById?.lastname}</p>
                                    <br />
                                    <p className="text-muted-foreground">อีเมล:</p>
                                    <p>{GeneralUserById?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-2/3 bg-gray-50 p-4 rounded-lg ml-4">
                            <h2 className="text-lg font-semibold mb-4">รายละเอียดบุคคลทั่วไป</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-muted-foreground">ที่อยู่:</p>
                                    <p>{GeneralUserById?.address}</p>
                                    <br />
                                    <p className="text-muted-foreground">วันเกิด:</p>
                                    <p>{GeneralUserById?.birthdate}</p>
                                    <br />
                                    <p className="text-muted-foreground">อายุ:</p>
                                    <p>{GeneralUserById?.age} ปี</p>
                                    <br />
                                    <p className="text-muted-foreground">เพศ:</p>
                                    <p>{GeneralUserById?.gender}</p>
                                    <br />
                                    <p className="text-muted-foreground">เบอร์โทร:</p>
                                    <p>{GeneralUserById?.phone}</p>
                                    <br />
                                    <p className="text-muted-foreground">อาชีพ:</p>
                                    <p>{GeneralUserById?.position}</p>
                                    <br />
                                    <p className="text-muted-foreground">รหัสผ่าน:</p>
                                    <p>{GeneralUserById?.password}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button id='deleteBtn' className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg" onClick={DeleteGeneralUserData}>ลบข้อมูล</button>
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
            ) : (
                <div className="flex flex-column items-center relative overflow-x-auto shadow-md sm:rounded-lg">
                    <img src="https://www.gokaidosports.in/Images/nodata.jpg" alt="" style={{ width: '50%' }} />
                    <br />
                    <p className='text-xl'>ไม่พบข้อมูลบุคคลทั่วไป</p>
                    <br />
                </div>
            )}
        </>
    );
}
