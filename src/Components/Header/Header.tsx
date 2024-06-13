import './Header.css';
import { Container , Nav , Navbar , Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
export default function Header() {


    const storedUser = localStorage.getItem("Loggedin");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const navigate = useNavigate();
    function handleLogOut (){
        localStorage.clear();

        const chk = confirm("ต้องการออกจากระบบหรือไม่?");
        if(chk){
           
            navigate('/');
            window.location.reload();
        }

    }


    return (
        <>
            {[false].map((expand) => (
                <Navbar key={'expand'} expand={expand} className="bg-body-tertiary mb-4">
                    <Container fluid>
                        <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    รายละเอียด
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <img style={{height:200 , width:200}} src="https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png" alt="" />
                                    <br />
                                    {user && <p>Username: {user.Username}</p>}
                                    <Nav.Link>Home</Nav.Link>
                                    <Nav.Link onClick={handleLogOut}>ออกจากระบบ</Nav.Link>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            ))}
        </>
    );
}