"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    KanbanSquare,
    Users,
    Settings,
    LogOut
} from 'lucide-react'


function AppSidebar() {
    const router = useRouter();
    const pathName = usePathname();

    const menuItems = [
        {
            title: "Home",
            items: [
                {
                    title: "Dashboard",
                    icon: LayoutDashboard,
                    url: "/dashboard"
                },
                {
                    title: "My Boards",
                    icon: KanbanSquare,
                    url: "/boards"
                },
                {
                    title: "Joined Boards",
                    icon: Users,
                    url: "/joined"
                },
                {
                    title: "Settings",
                    icon: Settings,
                    url: "/settings"
                },
            ]
        }
    ];



    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenuItem>
                    {/* <Link className='flex items-center w-full mt-1 mb-2' href={"/workflows"} prefetch>
                        <Image alt='OpenFlowX' className='w-fit h-10' width={100} height={100} src={theme === "dark" ? "/main/logo-dark.png" : "/main/logo.png"} />
                    </Link> */}
                    <span>Niro</span>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu >
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={item.url === "/" ? pathName === "/" : pathName.startsWith(item.url)}
                                            className='gap-x-4 h-10 px-4'
                                            asChild
                                        >
                                            <Link href={item.url} prefetch>
                                                <item.icon className='h-4 w-4' />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

        </Sidebar>
    )
}

export default AppSidebar
