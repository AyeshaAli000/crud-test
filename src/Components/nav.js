import React from 'react';
import {Menu, Container} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import Logo from './icons8-react.svg';

const Nav = () => {
    return(
    <Menu inverted >
        <Container>
            <Menu.Item 
            as={Link} to='/'>
                 <img src={Logo} size='small' alt='logo' style={{marginRight:'1.5rem'}}/>
             Home </Menu.Item>
            <Menu.Item name='About'
            as={Link} to='/About'
            content='About'/>
            <Menu.Item name='add'
            as={Link} to='/add'
            content='Add'/>
            <Menu.Item name='Login'
            as={Link} to='/Login'
            content='Login'/>
        </Container>
    </Menu>
    )
}

export default Nav;
