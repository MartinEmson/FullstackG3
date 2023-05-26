import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const ChatRoom = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await axios.get('http://localhost:3000/messages')
        setMessages(result.data)
      } catch (error) {
        console.error(error)
        console.log("is not working")
      }
    }
    fetchMessages()
    console.log(messages)
  }, [messages])

  return (
    <>
      <ChatBg>
        <ChatWindow>
          <LeftSide></LeftSide>
          <RightSide>
            <div className="message-wrapper">
              {messages.map((message) => (
                <div className="message" key={message.message_id}>
                  <p className="theMessage">Hej</p>
                  </div>
              ))}
            </div>
          </RightSide>
        </ChatWindow>
      </ChatBg>
    </>
  )
}

export default ChatRoom

const ChatBg = styled.div`
  background: linear-gradient(
    180.04deg,
    #fbbaa6 0.03%,
    rgba(255, 0, 0, 0.42) 202.92%
  );
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
`
const ChatWindow = styled.div`
  background-color: white;
  width: 1000px;
  height: 500px;
  margin-top: 150px;
  margin-bottom: 150px;
  border-radius: 15px;
`
const LeftSide = styled.div``
const RightSide = styled.div``
