import React from 'react'
import { API } from '@/api/api'
import styles from './login.module.scss'

const LoginPage = () => {
    const [values, setValues] = React.useState({
        username: 'username',
        password: 'password'
    })
    API.auth.getToken()
    const handleLogin = async () => {
       const returnData = await API.auth.login(values)
        if (returnData?.id && returnData?.login === true) {
            window.location.href = "/"
        }
    }    
    const handleChange = (e) => {
        setValues(prevState => ({...prevState, [e.target.name]: e.target.value}))
    }
    return ( 
    <div className={styles.container}>
        <div className={styles.loginBox}>
            <input name='username' value={values.username} onChange={handleChange}/>
            <input name='password' value={values.password} onChange={handleChange}/>
            <button onClick={handleLogin}>Log In</button>
        </div>
    </div>
    )
}


export default LoginPage
