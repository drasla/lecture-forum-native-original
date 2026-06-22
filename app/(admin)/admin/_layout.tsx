import { View, ScrollView } from "react-native";
import { Slot } from "expo-router";
import AdminAsideDesktop from "@/components/layouts/admin/AdminAsideDesktop";
import AdminAsideMobile from "@/components/layouts/admin/AdminAsideMobile";

function AdminLayout() {
    return (
        <View className="flex-1 bg-background-default md:flex-row flex-col">
            <View className="hidden md:flex h-full">
                <AdminAsideDesktop />
            </View>

            <View className="flex md:hidden w-full z-50">
                <AdminAsideMobile />
            </View>

            <View className="flex-1">
                <ScrollView
                    className="flex-1"
                    contentContainerClassName="p-4 md:p-8 items-center"
                    showsVerticalScrollIndicator={false}>
                    <View className="w-full max-w-[1000px]">
                        <Slot />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default AdminLayout;
