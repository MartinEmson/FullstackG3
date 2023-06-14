import React, { useEffect, useState, useContext, useRef } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { AuthContext } from '../context/AuthContext'

const ChatRoom = () => {
  const { loggedInUserId } = useContext(AuthContext)
  const chatBottomRef = useRef(null)

  const [validToken, setValidToken] = useState(false)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(false)
  const [answer, setAnswer] = useState(false)
  const [senders, setSenders] = useState([])
  const [answerName, setAnswerName] = useState('')
  const [recipientId, setRecipientId] = useState(null)
  const [replyingToMessage, setReplyingToMessage] = useState(null)
  const [send, setSend] = useState(false)
  // const [savedMessages, setSavedMessages] = useState([])

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages]) // Trigger the effect whenever the messages state changes

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
  }, [validToken])

  useEffect(() => {
    const fetchSenders = async () => {
      try {
        const result = await axios.get(`http://localhost:8900/users`)
        setSenders(result.data)
      } catch (error) {
        console.log(error)
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
  }, [])

  const [newMessage, setNewMessage] = useState({
    sender_id: loggedInUserId,
    recipient_id: null,
    message: '',
    recipientMessage: replyingToMessage
  })

  const handleChange = (event) => {
    setNewMessage({
      ...newMessage,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = (event, replyingToMessage) => {
    event.preventDefault()
    setSend(true)

    const messageData = {
      sender_id: loggedInUserId,
      recipient_id: recipientId,
      message: newMessage.message,
      recipientMessage: replyingToMessage
    }

    axios
      .post(`http://localhost:8900/messages`, messageData)
      .then((response) => {
        const { message_id } = response.data
        console.log(response.data)
        console.log(messageData)

        // setReplyingToMessage(replyingToMessage)
        // const repliedMessage = messages.find((message) => message.message === replyingToMessage)

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...newMessage,
            message_id
          }
        ])
        // setRecipientId(repliedMessage.sender_id)
        setAnswer(false)
        // setReplyingToMessage(null);
        setRecipientId(null)
        event.target.reset()
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

  //Handle Replay-button.
  const handleAnswer = async (
    event,
    recipientId,
    answerName,
    recipientMessage
  ) => {
    event.preventDefault()
    setAnswer(true)
    setAnswerName(answerName)

    const repliedMessage = messages.find(
      (message) => message.message === recipientMessage
    )
    setRecipientId(repliedMessage.sender_id)
    setNewMessage((prevMessage) => ({
      ...prevMessage,
      recipient_id: recipientId
    }))

    setReplyingToMessage(recipientMessage)
    setRecipientId(recipientId)
    console.log(repliedMessage.sender_id)
    console.log(recipientMessage)
  }

  //When clicking on X All the data related to Reply is reset.
  const removeRecipient = async () => {
    setAnswer(false)
    setAnswerName('')
    setNewMessage(null)
    setRecipientId(null)
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

                  const isUserMessage = message.sender_id === loggedInUserId
                  const isDeleteButtonVisible = isUserMessage
                  const isReplyMessage = message.recipient_id === recipientId
                  // Check if the current message is a reply

                  return (
                    <MessageContainer
                      key={message.message_id}
                      className="messageWrapper"
                      isUserMessage={isUserMessage}
                    >
                      {!isUserMessage ? (
                        <div className="senderInfo">
                          <img
                            src={sender.image}
                            alt="Profile"
                            className="profileImage"
                          />
                          <p className="senderName">{sender.user_firstname}</p>
                        </div>
                      ) : (
                        <div className="senderInfo">
                          <p className="senderName">{sender.user_firstname}</p>
                          <img
                            src={sender.image}
                            alt="Profile"
                            className="profileImage"
                          />
                        </div>
                      )}
                      {isReplyMessage && send && (
                        <div className="theMessageWrapper replyWrapper">
                          <p className="theMessage reply">
                            Reply to:{replyingToMessage}
                          </p>
                        </div>
                      )}
                      <div className="theMessageWrapper">
                        <p className="theMessage">{message.message}</p>
                      </div>
                      <div className="buttonWrapper">
                        {isDeleteButtonVisible && (
                          <button
                            type="button"
                            onClick={(event) =>
                              handleDelete(event, message.message_id)
                            }
                          >
                            Delete
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(event) =>
                            handleAnswer(
                              event,
                              recipientId,
                              sender.user_firstname,
                              message.message
                            )
                          }
                        >
                          Reply
                        </button>
                      </div>
                    </MessageContainer>
                  )
                })}
              </div>
              {answer && (
                    <div className="ifAnswer">
                      <p>Reply to: {answerName}</p>
                      <button onClick={removeRecipient}>X</button>
                    </div>
                  )}
              <div className="formWrapper">
                <form
                  method="post"
                  onSubmit={(event) => handleSubmit(event, replyingToMessage)}
                  className="form"
                >
                  <input
                    type="text"
                    name="message"
                    onChange={handleChange}
                    placeholder="Write someting.."
                  />
                  <button type="submit" className="submitButton">
                    Send
                  </button>
                  <div ref={chatBottomRef} />
                  {error && <p>Something went wrong, please try again.</p>}
                </form>
              </div>
            </RightSide>
          </ChatWindow>
        </ChatBg>
      ) : (
        <h1>Please log in first</h1>
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
  font-family: Inter, sans-serif;
`
const ChatWindow = styled.div`
  background-color: white;
  width: 90vw;
  height: 80vh;
  margin-top: 5vh;
  margin-bottom: 5vh;
  border-radius: 15px;
  overflow-y: scroll;

  @media (min-width: 700px) {
    width: 70vw;
    height: 80vh;
  }

  @media (min-width: 900px) {
    width: 50vw;
    height: 65vh;
  }
`

const LeftSide = styled.div``
const RightSide = styled.div`
  padding-bottom: 8vh;

  @media (min-width: 700px) {
   padding-bottom: 5vh;
  }

  @media (min-width: 700px) {
   padding-bottom: 5vh;
  }

  .formWrapper {
    display: flex;
    flex-direction: row;
    position: fixed;
    bottom: 5.3vh;
    height: 6vh;
    width: 90vw;
    border-top: solid #d9d9d9 0.5px;
    padding: 0.2vh 0 0 0;
    background-color: white;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }

  @media (min-width: 700px) {
    .formWrapper {
      width: 70vw;
      bottom: 5vh;
    }
  }

  @media (min-width: 900px) {
    .formWrapper {
      width: 50vw;
      bottom: 15vh;
    }
  }

  form {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }


  input {
    border: none;
    margin: 1vh;
    width: 50vw;
  }

  @media (min-width: 700px) {
    input {
      width: 50vw;
    }
  }

  @media (min-width: 900px) {
    input {
      width: 35vw;
    }
  }

  input[type='text'] {
    padding: 0 0 0 0vw;
    font-size: 16px;
  }

  @media (min-width: 900px) {
    input[type='text'] {
    padding: 0 0 0 0vw;
    font-size: 12px;
  }
  }

  input[type='text']:focus {
    outline-color: transparent;
    font-size: 16px;
  }

  @media (min-width: 900px) {
    input[type='text']:focus {
    padding: 0 0 0 0vw;
    font-size: 12px;
  }
  }

  .submitButton {
    border: none;
    background-color: white;
    margin: 0 0 0 10vw;
    cursor: pointer;
    font-size: 16px;
    color: coral;
  }

  @media (min-width: 700px) {
    .submitButton {
      margin: 0 0 0 2vw;
    }
  }

  @media (min-width: 900px) {
    .submitButton {
      margin: 0 0 0 2vw;
      font-size: 12px;
    }
  }

  .ifAnswer {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: grey;
    margin: 0;
    padding: 0;
  }

  @media (min-width: 900px) {
    .ifAnswer {
    font-size: 10px;
  }
  }

  .ifAnswer p {
    margin: 0.5vh 0 0 1vw;
  }

  .ifAnswer button {
    margin: 0.5vh 2vw 0 0;
    border: none;
    background-color: transparent;
  }

  .senderInfo {
    display: flex;
    flex-direction: row;
  }

  .profileImage {
    height: 40px;
    width: 40px;
    margin: 0 1vw 0 1vw;
    padding: 0 0 1vh 0;
  }

  @media (min-width: 900px) {
    .profileImage {
    height: 30px;
    width: 30px;
    margin: 0 .5vw 0 .5vw;
    padding: 0 0 1vh 0;
  }
  }


  .senderName {
    padding: 1.5vh 0 0 1vw;
    margin: 0;
  }

  @media (min-width: 900px) {
    .senderName {
    padding: 1.5vh 0 0 0vw;
    font-size: 11px;
  }
  }

  .theMessage {
    margin: 0;
    word-wrap: break-word;
    /* max-width: 60vw; */
  }

  @media (min-width: 900px) {
    .theMessage {
    margin: 0;
    word-wrap: break-word;
    font-size: 12px;
  }
  }

  .theMessageWrapper {
    background: #d9d9d9;
    border-radius: 10px;
    padding: 1.5vh 4vw 1.5vh 4vw;
    margin: 0 3vw 0 3vw;
    max-width: 40vw;
  }

  @media (min-width: 900px) {
    .theMessageWrapper {
    padding: 1vh 2vw 1vh 2vw;
    margin: 0 1vw 0 1vw;
    max-width: 18vw;
  }
  }

  .replyWrapper {
    background-color: #f4f4f4;
  }

  .reply {
    font-size: 12px;
    color: #939393;
  }
`

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 3vh 0;
  align-items: ${({ isUserMessage }) =>
    isUserMessage ? 'flex-end' : 'flex-start'};

@media (min-width: 900px) {
  margin: 0 0 2vh 0;
  }

  .buttonWrapper {
    margin-left: 3vw;
  }

  @media (min-width: 900px) {
    .buttonWrapper {
    margin-left: 1vw;
    margin-right: 1vw;
  }
  }

  button {
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0 1vw;
    cursor: pointer;
  }

  @media (min-width: 900px) {
    button {
      font-size: 10px;
      padding: 0 .3vw;
    }
  }
`
