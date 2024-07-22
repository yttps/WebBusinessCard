import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Swal from 'sweetalert2';
import { GeneralUserApi } from '@/ApiEndpoints/GeneralUserApi';
import { GetDataGeneralUserById } from '@/Model/GetGeneralUserById';
import { useNavigate } from 'react-router-dom';

export default function DetailGeneralUser() {

    const { id: generalUserId } = useParams();
    const generaluserapi = new GeneralUserApi();
    const [GeneralUserById, setGeneralUserById] = useState<GetDataGeneralUserById | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    const fetchData = async () => {
        try {
            if (generalUserId) {
                const resGetdataDetail = await generaluserapi.GetDataGeneralUserById(generalUserId);
                setGeneralUserById(resGetdataDetail);
                setIsLoading(true);
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            setIsLoading(false);
        }
    };

    const DeleteGeneralUserData = async (): Promise<void> => {

        if (!GeneralUserById) return;

        try {
            const result = await Swal.fire({
                title: 'ลบข้อมูล?',
                text: 'ยืนยันเพื่อทำการลบข้อมูล!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const response = await generaluserapi.DeleteGeneralUser(GeneralUserById?.id); //bug origin

                if (response == 200) {
                    await Swal.fire({
                        title: 'Success!',
                        text: 'ลบข้อมูลสำเร็จ!',
                        icon: 'success',
                    });
                    nav('/ListGeneralUser', { replace: true });
                }
            }
        } catch (error) {
            console.error('Error deleting general user:', error);
            await Swal.fire({
                title: 'Error!',
                text: 'เกิดข้อผิดพลาดในการลบข้อมูล!',
                icon: 'error',
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [generalUserId]);

    if (!isLoading) {
        return <div>is Loading...</div>;
    }

    if (!GeneralUserById) {
        return <div>Not Found Data General user</div>;
    }

    return (
        <>
            <Header />
            <br />
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
                    <button className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg" onClick={DeleteGeneralUserData}>ลบข้อมูล</button>
                </div>
            </div>
        </>
    );
}
