import styled from 'styled-components';

function HomePage() {
    return (
        <>
            <CenteredDiv>
                <ContentDiv>
                <h1>Welcome to ChatITHS</h1>
                    <p>A chat forum developed by Alexander, Joacim, Martin & Erica</p>
                </ContentDiv>
            </CenteredDiv>
        </>
    )
}

export default HomePage


const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
width: 60%;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
font-family: Inter, sans-serif;
`;

const ContentDiv = styled.div`

`;
