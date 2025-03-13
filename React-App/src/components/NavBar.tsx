import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import UserAccess from "./Auth/UserAccess";

const pages = ['Home','Dashboard','About','Exams',];

const NavBar = () => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    return (
        <>
            <AppBar  position="fixed" sx={{ backgroundColor: 'white', zIndex: 1201, boxShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}>
                <Container maxWidth={false} sx={{ margin: 0, padding: 0 }}>
                    <Toolbar disableGutters sx={{ margin: 0, padding: 0 }}>
                        <Typography component="div" sx={{ flexGrow: 0.1, color: "black", fontWeight: 'bold', paddingLeft: 0 }}>
                            Exams App
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-start' }}>
                            {pages.map((page) => (
                                <Box
                                    key={page}
                                    onMouseEnter={() => setHoveredButton(page)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                    sx={{
                                        position: 'relative',
                                        mx: 2,
                                    }}
                                >
                                    <Button
                                        component={Link}
                                        to={`/${page.toLowerCase()}`}
                                        sx={{
                                            textTransform: 'none',
                                            display: 'block',
                                            fontWeight: 'normal',
                                            backgroundColor: 'transparent',
                                            color: 'gray',
                                            '&:hover': {
                                                color: 'black',
                                            },
                                            '&:focus': {
                                                outline: 'none',
                                            },
                                        }}
                                    >
                                        {page}
                                    </Button>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: '-15px',
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            backgroundColor: 'black',
                                            transform: hoveredButton === page ? 'scaleX(1)' : 'scaleX(0)',
                                            transition: 'transform 0.3s ease-in-out',
                                            transformOrigin: 'left',
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                        <UserAccess/>
                    </Toolbar>
                    <Box sx={{ height: '1px', backgroundColor: 'lightgray' }} />
                </Container>
            </AppBar>
        </>
    );
};

export default NavBar;