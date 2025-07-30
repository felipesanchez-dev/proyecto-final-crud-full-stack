import React from 'react';
import { Container } from '@mui/material';
import NavigationBar from './NavigationBar';

const Layout = ({ children }) => {
  return (
    <div>
      <NavigationBar />
      <Container sx={{ marginTop: 4 }}>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
