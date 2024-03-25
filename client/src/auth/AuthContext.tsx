import { createContext, useCallback, useContext, useState } from 'react';
import { ChatContext } from '../context/chat/ChatContext';
import { customFetch, HttpResponse } from '../helpers/fetch';
import { ChatTypes } from '../types/chat.types';

export type AuthContextProps = {
    auth: IAuthState,
    isCurrentAdmin: () => boolean;
    login(email: string, password: string): Promise<boolean>;
    register(name: string, email: string, password: string): Promise<boolean>;
    verifyToken(): Promise<boolean>;
    logout(): void;

};


const initialAuthContext = {
    logout(): void { },
} as AuthContextProps;


export interface IAuthState {
    id: string | null;
    checking: boolean;
    logged: boolean;
    displayName: string | null;
    roles: string[]
}


const initialAuthState = {
    id: null,
    checking: true,
    logged: false,
    displayName: null,
    roles: []
} as IAuthState;

export interface IUser {
    id: string;
    online: boolean;
    displayName: string;
    roles: string[]
}




export type LoginResponse = {
    access_token: string;
    refresh_token: string;
    user: IUser;
}


export const AuthContext = createContext(initialAuthContext);


type AuthPropviderProps = { children: JSX.Element };


export const AuthProvider: React.FC<AuthPropviderProps> = ({ children }) => {

    const [auth, setAuth] = useState<IAuthState>(initialAuthState);

    const { dispatch } = useContext(ChatContext);


    const login = async (email: string, password: string) => {
        const loginResponse = await customFetch<LoginResponse>(
            {
                endpoint: 'auth/login',
                method: 'POST',
                data: { email, password },
            }
        );

        return handleLoginResponse(loginResponse);
    };

    const handleLoginResponse = (loginResponse: HttpResponse<LoginResponse>) => {
        if (loginResponse.ok) {
            const { access_token, refresh_token, user } = loginResponse.data as LoginResponse;
            const { id, displayName } = user;
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            setAuth(
                {
                    checking: false,
                    id,
                    logged: true,
                    displayName,
                    roles: user.roles
                }
            );
        }
        return loginResponse.ok;
    }

    const register = async (username: string, email: string, password: string) => {

        const registerResponse = await customFetch<LoginResponse>(
            {
                endpoint: 'auth/register-login',
                method: 'POST',
                data: { username, email, password },
            }
        );
        return handleLoginResponse(registerResponse);
    };

    const verifyToken = useCallback(
        async () => {
            loadAndSetTokenFromIframe();
             const accessToken = localStorage.getItem('accessToken');
             const refreshToken = localStorage.getItem('refreshToken');


            if (!(accessToken && refreshToken)) {
                setAuth(
                    {
                        ...initialAuthState,
                        logged: false,
                        checking: false,
                    }
                );
                return false;
            }
            const refreshResponse = await customFetch<LoginResponse>(
                {
                    endpoint: 'auth/refresh-token',
                    method: 'POST',
                    data: {
                        'refreshToken': refreshToken,
                    },
                }
            );
            if (refreshResponse.ok) {
                const { access_token, refresh_token, user } = refreshResponse.data as LoginResponse;
                const { displayName, id } = user;
                localStorage.setItem('accessToken', access_token);
                localStorage.setItem('refreshToken', refresh_token);
                setAuth(
                    {
                        checking: false,
                        id,
                        displayName,
                        logged: true,
                        roles: user.roles
                    }
                );
            } else {
                setAuth(
                    {
                        ...initialAuthState,
                        checking: false,
                        logged: false,
                    }
                );
            }

        }, []);

    const isCurrentAdmin = () => {
        return auth.roles.includes('Admin');
    }

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuth(
            {
                ...initialAuthState,
                checking: false,
                logged: false,
            }
        );
        dispatch({ type: ChatTypes.clean });
    }

    const loadAndSetTokenFromIframe = () => {
        const iframeToken = window.name;
        if (!iframeToken) {
            return;
        }
        let iframeJsonToken = null;
        try {
            iframeJsonToken = JSON.parse(iframeToken);
        } catch (e) {
            console.warn('Invalid Json frame token' + e.message)
            return null;
        }

        const accessToken = iframeJsonToken.access_token;
        const refreshToken = iframeJsonToken.refresh_token;
        const { id, displayName } = iframeJsonToken.user ?? {id: null, displayName: null};

        if (accessToken && refreshToken && id && displayName) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setAuth(
                {
                    checking: false,
                    id,
                    displayName,
                    logged: true,
                    roles: iframeJsonToken.roles
                }
            );
        }
    }

    const context = {
        auth,
        isCurrentAdmin,
        login,
        register,
        verifyToken,
        logout,
    } as AuthContextProps;

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}
