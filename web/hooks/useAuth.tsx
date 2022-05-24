import React, {useLayoutEffect} from 'react';
import nookies from 'nookies'

export const useAuthOnly = (redirectTo="/login") => {
  React.useEffect(()=>{
    const {client_id} = nookies.get({});
    if ( !client_id ) {
      window.location.href = redirectTo;
    }
  }, []);
};

