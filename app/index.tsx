import styled from "styled-components/native";

function HomeScreen() {
    return (
        <Container>
            <TitleText>메인 홈페이지 껍데기ㄷㄷㄷㄷㄷ</TitleText>
        </Container>
    );
}

export default HomeScreen;

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.background.default};
    padding: 20px;
`;

const TitleText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.theme.colors.text.default};
    margin-bottom: 30px;
`;