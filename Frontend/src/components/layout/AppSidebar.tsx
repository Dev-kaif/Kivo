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
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    KanbanSquare,
    Users,
    Settings,
    ChevronUpIcon,
    LogOutIcon,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetInfo } from '../Settings/hooks/useSuspenseMe';
import { useLogout } from '@/hooks/useLogout';
import Image from 'next/image';

function AppSidebar() {
    const pathName = usePathname();

    const { data } = useGetInfo();
    const { logout, isLoggingOut } = useLogout();

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
                    <Link className='flex items-center w-full mt-1 mb-2' href={"/dashboard"} prefetch>
                        <Image alt='Niro' className='w-fit h-11' width={100} height={100} src={"/main/logo.png"} />
                    </Link>
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
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm hover:bg-accent transition">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                                            <span className="text-sm font-semibold text-primary">
                                                {data?.name.slice(0, 2).toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <div className="font-semibold text-sm capitalize truncate">
                                                {data?.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground truncate max-w-40">
                                                {data?.email}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronUpIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="w-60 rounded-xl p-0 shadow-lg"
                            >
                                <div className="flex items-center gap-3 px-4 py-3">
                                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                                        <span className="text-sm font-semibold text-primary">
                                            {data?.name?.slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="min-w-0">
                                        <div className="font-semibold text-sm capitalize truncate">
                                            {data?.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground truncate">
                                            {data?.email}
                                        </div>
                                    </div>
                                </div>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    className="gap-2 px-4 py-3 cursor-pointer"
                                    onClick={() => logout()}
                                    disabled={isLoggingOut}
                                >
                                    <LogOutIcon className="h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar
