import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

interface NavbarCompProps {
    surveyName?: string;
    languagecodes?: string[];
    selectedLanguage?: string;
    onSelectLanguage?: (code: string) => void;
}

const NavbarComp: React.FC<NavbarCompProps> = (props) => {

    const languageSelector = (codes: string[]) => {
        return (<Nav className="ms-auto">
            <Navbar.Text className='me-1'>Language</Navbar.Text> 
            {(codes.length === 1) ?
                <Navbar.Text>{codes[0]}</Navbar.Text> :
                <NavDropdown title={props.selectedLanguage} align="end" id="basic-nav-dropdown">
                    {codes.map(code => <NavDropdown.Item
                        key={code}
                        onClick={() => {
                            if (props.onSelectLanguage) {
                                props.onSelectLanguage(code)
                            }
                        }}
                    >{code}</NavDropdown.Item>)}
                </NavDropdown>
                }

        </Nav>)
    }

    return (
        <Navbar bg="primary" variant="dark" className="py-1a">
            <div className="container">
                <Navbar.Brand>
                    CASE <span> Viewer</span>
                </Navbar.Brand>
                {props.surveyName ? <Navbar.Text>{props.surveyName}</Navbar.Text> : null}
                {props.languagecodes ? languageSelector(props.languagecodes) : null}
            </div>
        </Navbar>
    );
};

export default NavbarComp;
