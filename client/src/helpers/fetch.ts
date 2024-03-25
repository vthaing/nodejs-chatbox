const baseUrl = process.env.REACT_APP_API_URL;

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpResponse<T = any> = {
    ok: boolean;
    data?: T;
}


export type FetchOptions = {
    endpoint: string;
    data?: Record<string, unknown>; 
    method: HttpMethods;
    token?: string;
};

export const customFetch = async<T = any>(
   options: FetchOptions
): Promise<HttpResponse<T>> => {

    const {endpoint, method, data, token} = options;

    const url = `${baseUrl}/${endpoint}`;

    console.log(url);

    const init = {
        method,
    } as RequestInit;

    if (method === 'POST' || method === 'PUT' || method === 'PATCH' ){
        init.headers =  {
            'Content-type': 'application/json',
        };
    }

    if (token){
        init.headers = {
            ...init.headers,
            'Authorization': `Bearer ${token}`,
        };
    }

    init.body = JSON.stringify(data);
    

    const resp = await fetch(url, init);

    if (resp.status >= 210){
        return {
            ok: false,
        }
    }
    
    const response = await resp.json();
    return {
        data: response,
        ok: true,
    };
    
};


export const fetchSynchronous = (options: FetchOptions) => {
    const {endpoint, method, data, token} = options;
    const url = `${baseUrl}/${endpoint}`;
    const init = {
        method,
    } as RequestInit;
    if (method === 'POST' || method === 'PUT' || method === 'PATCH' ){
        init.headers =  {
            'Content-type': 'application/json',
        };
    }
    if (token){
        init.headers = {
            ...init.headers,
            'Authorization': `Bearer ${token}`,
        };
    }
    init.body = JSON.stringify(data);
    return fetch(url, init).then(response => {
        if (response.status >= 210) {
            return {
                ok: false
            }
        }
        return  response.json();
    }).then(response => {
        if (response.hasOwnProperty('ok')) {
            return response;
        }

        return {
            ok: true,
            data: response
        }
    });
}


