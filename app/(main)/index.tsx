import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import React from "react";

function HomeScreen() {
    // Pressable 컴포넌트
    // 터치 이벤트를 처리하는 가장 기초 컴포넌트
    // React에서는 어디에나 onClick 핸들러를 달면 동작했지만,
    // React-Native의 View 컴포넌트는 기본적으로 터치 이벤트를 감지하지 못함
    // Pressable 컴포넌트는 터치 이벤트를 감지하고, onPress 핸들러를 통해 이벤트를 처리할 수 있도록 감싸는 컴포넌트
    // onPress, onLongPress 사용 가능

    // asChild
    // Link 컴포넌트는 React에서 처럼, 이동을 할 수 있는 기능이 걸리는 부분이 맞으나, 모양을 꾸밀 수 없음.
    // 따라서 asChild를 사용하여 Link 컴포넌트의 자식으로 Pressable 컴포넌트를 사용해서
    // 이동되는 기능을 자식에게 부여하는 방식으로 사용

    return (
        <View className="flex-1 justify-center items-center bg-background-default p-5">
            <Text className="text-2xl font-bold text-text-default mb-[30px]">
                메인 홈페이지 껍데기
            </Text>

            <Link href="/auth/register" asChild>
                <Pressable className="bg-primary-main py-[15px] px-[30px] rounded-lg">
                    <Text className="text-primary-contrastText text-base font-bold">
                        회원가입 화면으로 이동
                    </Text>
                </Pressable>
            </Link>
        </View>
    );
}

export default HomeScreen;
