import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetDataCompanyById } from '@/Model/GetCompanyById';
import Header from '../Header/Header';
// import { Row, Col, Button } from 'react-bootstrap';
import  { Button }  from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function DetailCompany() {

    const { id: companyId } = useParams();
    const companyapi = new CompanyApi();
    const [companyById, setCompanyById] = useState<GetDataCompanyById | null>(null);
    // const [LogoCompany, setLogoCompany] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    const fetchData = async () => {
        try {

            if (companyId) {

                const resGetdataDetail = await companyapi.GetDataCompanyById(companyId);

                console.log('get by id', resGetdataDetail);

                setCompanyById(resGetdataDetail);
                // setLogoCompany(companyapi.setUrlLogo);
                setIsLoading(true);
                console.log("Fetched response:", resGetdataDetail);


            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            setIsLoading(false);
        }
    };

    const DeleteCompanyData = async () => {

        if (!companyById) return;

        const chk = confirm("ยืนยันเพื่อทำการลบข้อมูล!");

        if (chk) {

            try {

                console.log("com id", companyById?.id);
                
                const response = await companyapi.DeleteCompany(companyById.id);

                if (response == 200) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'ลบข้อมูลสำเร็จ!',
                        icon: 'success',
                    });
                    
                    await companyapi.GetAllCompany();
                    nav('/ListCompany', { replace: true });
                }
            } catch (error) {
                console.error('Error deleting company:', error);
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

    }, [companyId]);


    if (!companyById) {
        return <div>No company data found.</div>;
    }

    return (
        <div>
            <Header />
            <h1>Company Details</h1>
            <p>Name: {companyById.name}</p>
            <p>Email: {companyById.email}</p>
            <p>Business Type: {companyById.businessType}</p>
            <p>Website: {companyById.website}</p>
            <p>Year Founded: {companyById.yearFounded}</p>
            <p>Address : {companyById.address}</p>
            <p>Password : {companyById.password}</p>
            <div id="col2-2">
                <Button id='delete-btn' variant="danger" onClick={DeleteCompanyData}>ลบข้อมูล</Button>
            </div>
            <div>
                <img src={companyById.logo} alt="" />
            </div>

        </div>
    );


}