'use client'

import 'reflect-metadata'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Loader2, User } from 'lucide-react';
import { useUser } from '@/redux/actions/user';
import { useLogout } from '@/redux/actions/auth';
import Link from 'next/link';
// import { Role } from '@dodzo-web/shared';
import { useAppSelector } from '@/redux/store';

export function UserMenu() {
    // TODO remove with redux value due to rehydration
    const { isLoading } = useUser();
    const user = useAppSelector(({ auth }) => auth.user);
    const logout = useLogout();

    if (isLoading) {
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    if (!user) {
        return (
            <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                </Button>
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.email}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/profile/orders">Orders</Link>
                </DropdownMenuItem>
                {
                    user.roles.includes("super_admin") && ( // TODO class-transformer error
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Admin Dashboard</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href="/admin/products">Products</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin/users">Users</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin/orders">Orders</Link>
                            </DropdownMenuItem>
                        </>
                    )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout.mutate()}>
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
