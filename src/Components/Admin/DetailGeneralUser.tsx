import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import { Button } from 'react-bootstrap';
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
            <div>DetailGeneralUser</div>
            <p>name : {GeneralUserById?.firstname}</p>
            <p>lastname : {GeneralUserById?.lastname}</p>
            <p>email : {GeneralUserById?.email}</p>
            <p>gender : {GeneralUserById?.gender}</p>
            <p>password : {GeneralUserById?.password}</p>
            <p>phone : {GeneralUserById?.phone}</p>
            <img src={GeneralUserById?.profile} alt="Profile" />
            <Button variant="danger" onClick={DeleteGeneralUserData}>delete</Button>
        </>
    );
}
