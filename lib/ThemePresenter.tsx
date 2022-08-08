import { ReactElement, useContext, useMemo } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const ThemePresenter= (props: { children: ReactElement | ReactElement[]; }) => {
    const { prefersDarkMode } = useContext(ThemeContext);
    const fonts = '"Vazirmatn","Roboto","Helvetica","Arial",sans-serif';
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                    background: {
                        default: prefersDarkMode ? '#121212f2' : '#fffffff2',
                        paper: prefersDarkMode ? '#121212f2' : '#fffffff2'
                    },
                },
                typography: {
                    fontFamily: fonts,
                },
                components: {
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: prefersDarkMode ? '#121212' : '#1976d2',
                            },
                        },
                    },
                    MuiLink: {
                        styleOverrides: {
                            root: {
                                textDecoration: 'none',
                                cursor: 'pointer',
                            },
                        },
                    },
                    MuiDialogTitle: {
                        defaultProps: {
                            textAlign: 'center',
                        }
                    },
                    MuiListItemText: {
                        defaultProps: {
                            primaryTypographyProps: {
                                textAlign: 'start',
                            }
                        }
                    },
                    MuiFormHelperText: {
                        styleOverrides: {
                            root: {
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '0.5rem',
                                marginBottom: '0.5rem',
                                textAlign: 'center',
                            }
                        }
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                width: 'fit-content',
                            },
                        },
                    },
                    MuiAlert: {
                        styleOverrides: {
                            root: {
                                padding: '6px',
                            },
                            icon: {
                                alignItems: 'center',
                                margin: '2px',
                                padding: '2px',
                            },
                            message: {
                                padding: '4px',
                                alignItems: 'center',
                                display: 'inline-flex',
                            },
                            action: {
                                order: 1,
                                padding: '2px',
                                margin: '2px',
                            }
                        }
                    },
                    MuiCardHeader: {
                        styleOverrides: {
                            title: {
                                textAlign: 'center',
                            },
                        },
                    },
                },
            }),
        [prefersDarkMode],
    );
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    );
};

export default ThemePresenter;