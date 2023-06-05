import React from 'react'
import axios from 'axios'
import { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import UserContext from '../context/UserContext'

const ChatRoom = () => {
  const loggedInUserId = useContext(UserContext)

  const [validToken, setValidToken] = useState(false)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(false)
  // const [answerRecipientId, setAnswerRecipientId] = useState(null)
  const [answerRecipientMessage, setAnswerRecipientMessage] = useState('')
  const [answer, setAnswer] = useState(false)
  const [senders, setSenders] = useState([])
  const [answerName, setAnswerName] = useState('')

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
    console.log(validToken)
  }, [validToken])

  useEffect(() => {
    const fetchSenders = async () => {
      try {
        const result = await axios.get(`http://localhost:8900/users`)
        setSenders(result.data)
        console.log(senders)
      } catch (err) {
        console.log(err)
      }
    }
    fetchSenders()
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await axios.get(`http://localhost:8900/messages`)
        setMessages(result.data)
      } catch (error) {
        setError(true)
        console.error(error)
      }
    }
    fetchMessages()
    console.log(messages)
    console.log(loggedInUserId)
  }, [])

  const [newMessage, setNewMessage] = useState({
    sender_id: loggedInUserId,
    recipient_id: null,
    message: ''
  })

  const handleChange = (event) => {
    setNewMessage({
      ...newMessage,
      [event.target.name]: event.target.value
    })
    console.log(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const messageData = {
      sender_id: loggedInUserId,
      recipient_id: newMessage.recipient_id,
      message: newMessage.message
    }

    axios
      .post(`http://localhost:8900/messages`, messageData)
      .then((response) => {
        const { message_id } = response.data
        console.log(response.data)
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...newMessage,
            message_id
          }
        ])
        event.target.reset()
        window.location.reload()
        console.log(messages)
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleDelete = async (event, messageId) => {
    event.preventDefault()
    try {
      await axios.delete(`http://localhost:8900/messages/${messageId}`)
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.message_id !== messageId)
      )
      console.log(messageId)
      console.log('Message deleted')
    } catch (error) {
      console.error(error)
    }
  }

  const handleAnswer = async (
    event,
    recipientId,
    answerName,
    recipientMessage
  ) => {
    event.preventDefault()
    setAnswer(true)
    setAnswerName(answerName)
    setAnswerRecipientMessage(recipientMessage)
    setNewMessage((prevMessage) => ({
      ...prevMessage,
      recipient_id: recipientId
    }))
    console.log(recipientId)
  }

  return (
    <>
      {validToken ? (
        <ChatBg>
          <ChatWindow>
            <LeftSide></LeftSide>
            <RightSide>
              <div className="message-wrapper">
                {messages.map((message) => {
                  const sender = senders.find(
                    (user) => user.user_id === message.sender_id
                  )
                  // console.log(sender.user_firstname)
                  return (
                    <div key={message.message_id} className="message">
                      <p className="theMessage">
                        {sender.user_firstname}
                        {message.message}
                        {message.sender_id}
                        {message.recipient_id}
                        {message.message_id}
                      </p>
                      <button
                        type="button"
                        onClick={(event) =>
                          handleDelete(event, message.message_id)
                        }
                      >
                        Ta bort
                      </button>
                      <button
                        type="button"
                        onClick={(event) =>
                          handleAnswer(
                            event,
                            message.recipient_id,
                            sender.user_firstname,
                            message.message
                          )
                        }
                      >
                        Svara
                      </button>
                    </div>
                  )
                })}
              </div>
              <ChatInput>
                <form method="post" onSubmit={handleSubmit}>
                  {answer && `Svara ${answerName} ${answerRecipientMessage}`}
                  <input
                    type="text"
                    name="message"
                    onChange={handleChange}
                    placeholder="Skriv ditt meddalande här"
                  />
                  <button type="submit">Skicka</button>
                  {error && <p>Något blev fel, försök igen.</p>}
                </form>
              </ChatInput>
            </RightSide>
          </ChatWindow>
        </ChatBg>
      ) : (
        <h1>Vänligen logga in</h1>
      )}
    </>
  )
}

export default ChatRoom

const ChatBg = styled.div`
  display: flex;
  justify-content: center;
  height: 80vh;
  width: 100%;
`
const ChatWindow = styled.div`
  background-color: white;
  width: 90vw;
  height: 80vh;
  margin-top: 5vh;
  margin-bottom: 5vh;
  border-radius: 15px;
  overflow-y: scroll;
`
const LeftSide = styled.div``
const RightSide = styled.div`
input[type=text] {
  width: 15vw;
  transition: width 0.4s ease-in-out;
}

input[type=text]:focus {
  width: 80vw;
}

button {
  /* position: absolute;
  right: 0; */
}
`
const ChatInput = styled.div`
display: flex;
height: 7vh;
/* position: sticky;
bottom: 0; */
border: solid black 1px


`
