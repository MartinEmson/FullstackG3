import { useEffect, useState } from 'react'
import Axios from 'axios'

const SomePage = () => {
    const [validToken, setValidToken] = useState(false)

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await Axios.get(
                    'http://localhost:8900/check-token',
                    {
                        headers: {
                            token: localStorage.getItem('token')
                        }
                    }
                )

                if (response.status === 200) {
                    setValidToken(true)
                }
            } catch (error) {
                setValidToken(false)
            }
        }

        checkToken()
    }, [])

    return (
        <div>
            {validToken ? (
                <h1>Du har ett Token!</h1>
            ) : (
                <h1>Vänligen logga in</h1>
            )}
        </div>
    )
}

export default SomePage
