import React from 'react'
import { UserContext } from '../context/userContext'

export const useUser = () => {
    const context = React.useContext(UserContext)
    const [user, setUser] = React.useState(context.user)

    React.useEffect(()=>{
         setUser(context.user)
    },[])


    return user
}
