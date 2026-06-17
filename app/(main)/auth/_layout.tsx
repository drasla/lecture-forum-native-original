import useAuthStore from "@/stores/auth/useAuthStore";
import { Redirect, Slot } from "expo-router";

function AuthLayout() {
    const { isLoggedIn } = useAuthStore();

    if (isLoggedIn) {
        return <Redirect href={"/"} />;
    }

    // Slot : react-router에서 Slot과 같은 기능이나, 화면 전환 애니메이션이 포함되어 있지 않음
    // 현재 URL 경로에 맞는 자식 화면이 그 자리에 대체됨
    // 뒤로가기 스와이프가 동작되지도 않고 애니메이션도 당연히 제공되지 않음

    // Stack : react-router에서 Outlet과 같은 기능이나, 화면 전환 애니메이션이 포함되어 있음
    // 현재 URL 경로에 맞는 자식 화면을 얹어서 보여주는 형태로 제공됨
    // 그렇기 때문에 뒤로가기 스와이프가 동작하고 애니메이션도 제공됨
    return <Slot />;
}

export default AuthLayout;
