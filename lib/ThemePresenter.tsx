import { ReactElement, useContext, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { ThemeContext } from './context/ThemeContext';

const ThemePresenter = (props: { children: ReactElement | ReactElement[]; }) => {
    const { prefersDarkMode } = useContext(ThemeContext);
    const fonts = '"Vazirmatn","Roboto","Helvetica","Arial",sans-serif';
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',

                },
                typography: {
                    fontFamily: fonts,
                },
                components: {
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