import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react'; // Correct import names
import { useNavigate } from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();

    return (
        <Menu inverted borderless style={{ padding: "0.3rem", marginBottom: "20px" }} attached>
            <Container>
                <Menu.Item>
                    <h2>React Firebase CRUD with Upload Image</h2>
                </Menu.Item>
                <Menu.Item position="right">
                    <Button size="mini" primary onClick={() => navigate("/add")}>
                        Add User
                    </Button>
                </Menu.Item>
            </Container>
        </Menu>
    );
}

export default NavBar;
