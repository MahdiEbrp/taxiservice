import axios, { AxiosError } from 'axios';
export type SigninResult = {
    error: string | undefined;
    status: number;
    ok: boolean;
    url: string | null;
};
const timeout = 10000;
export const postData = async (url: string, data: unknown) => {
    try {
        const response = await axios.post(url, JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: timeout,
        });
        return response;

    }
    catch (err) {
        const { response } = err as AxiosError;
        if (response)
            return response;
        else
            return null;
    }
};
export const getData = async (url: string) => {
    try {
        const response = await axios.get(url, { timeout: timeout });
        return response;

    }
    catch (err) {
        const { response } = err as AxiosError;
        if (response)
            return response;
        else
            return null;
    }
};
export const putData = async (url: string, data: unknown) => {
    try {
        const response = await axios.put(url, JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: timeout,
        });
        return response;

    }
    catch (err) {
        const { response } = err as AxiosError;
        if (response)
            return response;
        else
            return null;
    }
};
export const deleteData = async (url: string) => {
    try {
        const response = await axios.delete(url);
        return response;

    }
    catch (err) {
        const { response } = err as AxiosError;
        if (response)
            return response;
        else
            return null;
    }
};
export const patchData = async (url: string, data: unknown) => {
    try {
        const response = await axios.patch(url, JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: timeout,
        });
        return response;

    }
    catch (err) {
        const { response } = err as AxiosError;
        if (response)
            return response;
        else
            return null;
    }
};
