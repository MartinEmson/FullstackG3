import React from 'react'
// import styled from 'styled-components'

function ProfilePage() {
    return (
        <div className='form--background'>
            <div className="form--container">
                <div className='form-nav'></div>
                <form className='form' action="">
                    <label htmlFor="">Display Name</label>
                    <input type="text" />
                    <label htmlFor="">UserName</label>
                    <input type="text" />
                    <label htmlFor="">Email</label>
                    <input type="text" />
                    <label htmlFor="">Phone Number</label>
                    <input type="text" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    )
}

export default ProfilePage

// const FormContainer = styled.div`
// background-color: blue; `
