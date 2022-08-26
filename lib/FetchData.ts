import axios, { AxiosError } from 'axios';
export interface SigninResult {
    error: string | undefined;
    status: number;
    ok: boolean;
    url: string | null;
}
const timeout = 10000;
export const PostData = async (url: string, data: unknown) => {
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
        if (err instanceof AxiosError) {
            return err.response;
        }
        else
            return null;
    }
};
export const GetData = async (url: string) => {
    try {
        const response = await axios.get(url,{timeout: timeout});
        return response;

    }
    catch (err) {
        if (err instanceof AxiosError) {
            return err.response;
        }
        else
            return null;
    }
};
export const PutData = async (url: string, data: unknown) => {
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
        if (err instanceof AxiosError) {
            return err.response;
        }
        else
            return null;
    }
};
export const DeleteData = async (url: string) => {
    try {
        const response = await axios.delete(url);
        return response;

    }
    catch (err) {
        if (err instanceof AxiosError) {
            return err.response;
        }
        else
            return null;
    }
};
export const PatchData = async (url: string, data: unknown) => {
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
        if (err instanceof AxiosError) {
            return err.response;
        }
        else
            return null;
    }
};
