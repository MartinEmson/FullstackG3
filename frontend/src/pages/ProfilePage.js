import React from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
// import { useNavigate } from 'react-router-dom'
// import UserContext from '../context/UserContext'
import { AuthContext } from '../context/AuthContext'
//Use state med object för att kunna uppdatera olika values

const ProfilePage = () => {
  const [updateProfile, setUpdateProfile] = useState({
    user_firstname: '',
    user_lastname: '',
    title: '',
    password: '',
    image: ''
  })

  const { loggedInUserId } = useContext(AuthContext)

  const [validToken, setValidToken] = useState(false)
  const [profile, setProfile] = useState([]) // profile är för att hämta befintliga värden i databasen
  const [initialProfile, setInitialProfile] = useState({}) // initialProfile är också värden från databasen, sparas även här för att kunna behålla vården i placeholdern.
  const [error, setError] = useState(false)
  const [inputsDisabled, setInputsDisabled] = useState(true) // För att göra inputs disable innan man tryckt på edit profile.
  const [imageInputVisible, setImageInputVisible] = useState(false) // För att hålla reda på synligheten av input-fältet för ImageContainer
  // const location = useLocation()
  // const navigate = useNavigate()

  // const userid = location.pathname.split('/')[2] // Tar den andra i arrayen alltså userid. I denna kod är users 1. Avgränsas av /

  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     navigate('/login')
  //   } else {
  //     localStorage.setItem('loggedInUserId', loggedInUserId);
  //   }
  // }, [isAuthenticated, loggedInUserId, navigate]);


  // Kolla så att ett giltigt token finns
  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get('http://localhost:8900/check-token', {
          headers: {
            token: localStorage.getItem('token')
          }
        })

        if (response.status === 200) {
          setValidToken(true)
        }
      } catch (error) {
        setValidToken(false)
      }
    }

    checkToken()
  }, [])

  //Gör en Get requset till server där setProfile updaterar profile och därmed värderna i databasen.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8900/users/${loggedInUserId}`
        )
        setProfile([res.data])
        setInitialProfile(res.data) // Sparar ursprungliga värderna i profile
        setUpdateProfile(res.data) // Sparar ursprungliga värderna i update profile
      } catch (err) {
        console.log(err)
      }
    }
    fetchUser()
  }, [loggedInUserId])

  //funktion som hanterar ändringar. Spread ... syntax tar in värderna från updateProfile som sedan kan ändras av användaren. setUpdateProfile skickar de nya värderna till updateProfile.
  const handleChange = (e) => {
    setUpdateProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Funktion att spara nya värden när man trycker på spara. Nytt värde updatedProfile som tar in initial profile och updateProfile för att både uppdaterade värden men också initial värden ska vara med så att användaren inte behöver uppdatera alla värden.
  const handleClick = async (e) => {
    e.preventDefault()
    try {
      const updatedProfile = {
        ...initialProfile,
        ...updateProfile
      }
      await axios.put(
        `http://localhost:8900/users/${loggedInUserId}`,
        updatedProfile
      )
      window.location.reload()
      console.log('User Updated')
      console.log(loggedInUserId)
    } catch (err) {
      console.log(err)
      setError(true)
    }
  }


  //Function för att disable inputs samt synlighet av image-input
  const handleEditClick = () => {
    setInputsDisabled(false)
    setImageInputVisible(true)
  }


  //Funktion dropdown menu med bilder
  const handleImageChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex] // Väljer ut indexet på de olika options i select-elementet
    const imageUrl = selectedOption.getAttribute('data-image-url') // Hämtar värder från data-image-url
    setUpdateProfile((prev) => ({
      ...prev,
      image: imageUrl
    }))
  }

  return (
    <div>
      {validToken ? (
        <>
          <FormBackground>
            <FormContainer>
              <FormNav>
                <ImageContainer
                  src={updateProfile.image || profile[0]?.image}
                  alt="Profile Image"
                />
                {imageInputVisible && (
                  <Imginput
                    as="select"
                    name="image"
                    onChange={handleImageChange}
                    disabled={inputsDisabled}
                    value={updateProfile.image}
                  >
                    <option value="">Select an image</option>
                    <option
                      value="https://img.freepik.com/premium-vector/businessman-profile-cartoon_18591-58479.jpg?w=2000"
                      data-image-url="https://img.freepik.com/premium-vector/businessman-profile-cartoon_18591-58479.jpg?w=2000"
                    >
                      Man
                    </option>
                    <option
                      value="https://mir-s3-cdn-cf.behance.net/project_modules/disp/49c16a38805735.57701dcdd452c.gif"
                      data-image-url="https://mir-s3-cdn-cf.behance.net/project_modules/disp/49c16a38805735.57701dcdd452c.gif"
                    >
                      Hard worker
                    </option>
                    <option
                      value="https://cdn.dribbble.com/users/1632728/screenshots/4693038/media/c277ac982112db2505e7e2de2d7a2af6.gif"
                      data-image-url="https://cdn.dribbble.com/users/1632728/screenshots/4693038/media/c277ac982112db2505e7e2de2d7a2af6.gif"
                    >
                      Hey guy
                    </option>
                    <option
                      value="https://img.freepik.com/premium-vector/woman-profile-cartoon_18591-58480.jpg?w=2000"
                      data-image-url="https://img.freepik.com/premium-vector/woman-profile-cartoon_18591-58480.jpg?w=2000"
                    >
                      Woman
                    </option>
                    <option
                      value="https://cdna.artstation.com/p/assets/images/images/023/576/078/original/ying-chen-me-optimize.gif?1579652163"
                      data-image-url="https://cdna.artstation.com/p/assets/images/images/023/576/078/original/ying-chen-me-optimize.gif?1579652163"
                    >
                      Happy women
                    </option>
                  </Imginput>
                )}
              </FormNav>
              <Form>
                <Label htmlFor="user_firstname">Display Name</Label>
                <Input
                  type="text"
                  name="user_firstname"
                  placeholder={profile[0]?.user_firstname}
                  onChange={handleChange}
                  disabled={inputsDisabled}
                  value={updateProfile.user_firstname}
                />
                <Label htmlFor="user_lastname">Last Name</Label>
                <Input
                  type="text"
                  name="user_lastname"
                  placeholder={profile[0]?.user_lastname}
                  onChange={handleChange}
                  disabled={inputsDisabled}
                  value={updateProfile.user_lastname}
                />
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder={profile[0]?.title}
                  onChange={handleChange}
                  disabled={inputsDisabled}
                  value={updateProfile.title}
                />
                <Label htmlFor="password">Password</Label>
                <Input
                  type="text"
                  name="password"
                  placeholder={profile[0]?.password}
                  onChange={handleChange}
                  disabled={inputsDisabled}
                  value={updateProfile.password}
                />
                {inputsDisabled ? (
                  <InputButton onClick={handleEditClick} value="Edit Profile" />
                ) : (
                  <InputButton onClick={handleClick} value="Save Changes" />
                )}
                {error && <p>Något blev fel, försök igen.</p>}
              </Form>
            </FormContainer>
          </FormBackground>
        </>
      ) : (
        <h1>Vänligen logga in</h1>
      )}
    </div>
  )
}

export default ProfilePage

const FormBackground = styled.div`

font-family: sans-serif;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;

`

const ImageContainer = styled.img`
  background-color: white;
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  position: absolute;
  left: 15%;
  right: 78.73%;
  top: 32%;
  bottom: 73.79%;

  @media screen and (min-width: 690px) {
    height: 6rem;
    width: 6rem;
    position: absolute;
    left: 28%;
    top: 29%;
  }
`
const Imginput = styled.input`
  height: 2rem;
  width: 10rem;
  border-radius: 0.3rem;
  border: 1.5px solid black;
  position: absolute;
  right: 17%;
  top: 42%;


  @media screen and (min-width: 690px) {
    position: absolute;
    top: 33%;
    right: 55%;
  }
`

const FormContainer = styled.div`
  background-color: white;
  width: 90vw;
  height: 70vh;
  border-radius: 0.5rem;

  @media screen and (min-width: 690px) {
    height: 70vh;
    width: 50vw;
  }
  @media screen and (max-width: 380px) {
    height: 80vh;
  }
`

const FormNav = styled.div`
background: linear-gradient(#FBBAA6 10%, #d15151a4);
  height: 9vh;
  border-radius: 0.5rem 0.5rem 0rem 0rem;

  @media screen and (min-width: 690px) {
    height: 11vh;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 8rem;


  @media screen and (min-width: 690px) {
    margin-top: 4rem;
  }
`

const Input = styled.input`
height: 40px;
width: 250px;
  border-radius: 0.3rem;
  border: 1.5px solid black;
  text-indent: 5px;
  font-size 16px;
  margin-left: 2rem;
  line-height: 2rem;
  margin-top: 10px;

  @media screen and (min-width: 690px) {
    height: 1.3rem;
    margin-bottom: 0rem;
    height: 40px;
    width: 400px;
    text-indent: 15px;
  margin-bottom: 20px;
  font-size 16px;
  }
`

const InputButton = styled.input`
  background: #5883f2;
  height: 2.5rem;
  width: 8rem;
  border-radius: 0.3rem;
  border: 1.5px solid white;
  color: white;
  font-size: large;
  text-align: center;
  cursor: pointer;

  position: absolute;
  left: 50%;
  top: 35%;
  @media screen and (min-width: 690px) {
    height: 2.5rem;
    font-size: small;
    left: 59%;
    top: 32%;
  }
`
const Label = styled.label`
  margin-bottom: 0.2rem;
  font-size: 10px;
  font-weight: bold;
  margin-left: 2rem;

  @media screen and (min-width: 690px) {
    font-size: x-small;
    padding-left: 1rem;
    margin-bottom: 0rem;
  }
`
