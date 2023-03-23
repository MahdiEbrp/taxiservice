import { ReactElement, useContext, useMemo } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
const ThemePresenter = (props: { children: ReactElement | ReactElement[]; }) => {
    const { prefersDarkMode } = useContext(ThemeContext);
    const fonts = '"Vazirmatn","Roboto","Helvetica","Arial",sans-serif';
    const breakpoints = createBreakpoints({});
    const appbarHeight = [breakpoints.up('md')] ? '64px' : '56px';
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                    background: {
                        default: prefersDarkMode ? '#121212c2' : '#ffffffc2',
                        paper: prefersDarkMode ? '#121212c2' : '#ffffffc2'
                    },
                },
                typography: {
                    fontFamily: fonts,
                },
                components: {
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backdropFilter: 'blur(3px)',
                                maxWidth: '100%',
                            },
                        },
                    },
                    MuiDrawer: {
                        styleOverrides: {
                            paper: {
                                marginTop: appbarHeight,
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: prefersDarkMode ? '#121212' : '#1976d2',
                                height: appbarHeight,
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
                    MuiList: {
                        defaultProps: {
                            style: {
                                backgroundColor: prefersDarkMode ? '#1e1e1ea3' : '#ffffff6e',
                            }
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
        [appbarHeight, prefersDarkMode],
    );
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    );
};

export default ThemePresenter;