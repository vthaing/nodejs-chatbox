import React, { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext';

export const SearchBox: React.FC = () => {

    const { auth, logout } = useContext(AuthContext);

    const { displayName } = auth;

    return (
        <>
            <div className="headind_srch">
                <div className="recent_heading mt-2">
                    <h4>{displayName}</h4>
                </div>
                <div className="srch_bar">
                    <div className="stylish-input-group">
                        <button
                            className="btn text-danger"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
