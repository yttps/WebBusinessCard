import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../Header/Header';
// import { Row, Col, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { GeneralUserApi } from '@/ApiEndpoints/GeneralUserApi';
import { GetDataCompanyById } from '@/Model/GetCompanyById';
import { useNavigate } from 'react-router-dom';

export default function DetailGeneralUser() {

    const { id: generalUserId } = useParams();
    const generaluserapi = new GeneralUserApi();
    const [GeneralUserById, setGeneralUserById] = useState<GetDataCompanyById | null>(null);
    // const [LogoCompany, setLogoCompany] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    const fetchData = async () => {
        try {

            if (generalUserId) {

                const resGetdataDetail = await generaluserapi.GetDataGeneralUserById(generalUserId);

                console.log('get by id', resGetdataDetail);

                setGeneralUserById(resGetdataDetail);
                // setLogoCompany(companyapi.setUrlLogo);
                setIsLoading(true);
                console.log("Fetched response:", resGetdataDetail);


            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            setIsLoading(false);
        }
    };

    const DeleteGeneralUserData = async () => {

        if (!GeneralUserById) return;

        const chk = confirm("ยืนยันเพื่อทำการลบข้อมูล!");

        if (chk) {

            try {

                console.log("com id", GeneralUserById?.id);
                const response = await generaluserapi.DeleteGeneralUser(GeneralUserById?.id);

                if (response == 200) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'ลบข้อมูลสำเร็จ!',
                        icon: 'success',
                    });
                    nav('ListGeneralUser');
                }
            } catch (error) {
                console.error('Error deleting general user:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'เกิดข้อผิดพลาดในการลบข้อมูล!',
                    icon: 'error',
                });
            }
        }
    }



    useEffect(() => {

        if (!isLoading) {
            fetchData();
        }

    }, [generalUserId]);

    return (
        <>
            <Header />
            <div>DetailGeneralUser</div>
            <button onChange={DeleteGeneralUserData}>delete</button>
        </>

    )
}