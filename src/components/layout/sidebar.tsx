'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-context';
import { filterMenuByPermissions } from '@/lib/permissions';
import type { SidebarItem, SidebarConfig } from '@/lib/types';
import { sidebarConfig } from '@/config/sidebar.config';

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed = false, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(isCollapsed);

  // Filtrar menú según permisos del usuario
  const visibleMenu = useMemo(() => {
    return filterMenuByPermissions(sidebarConfig.sections, user);
  }, [user]);

  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapsedChange?.(newState);
  }

  const renderItem = (item: SidebarItem, depth: number = 0): React.ReactNode => {
    const isActive = pathname === item.route || pathname.startsWith((item.route || '') + '/');
    const hasChildren = item.children && item.children.length > 0;

    const IconComponent = (Icons[item.icon as keyof typeof Icons] as React.ComponentType<any>) || Icons.FileIcon;

    if (hasChildren) {
      return (
        <SidebarItemWithChildren
          key={item.id}
          item={item}
          IconComponent={IconComponent}
          isActive={isActive}
          collapsed={collapsed}
          depth={depth}
          pathname={pathname}
        />
      );
    }

    if (!item.route) {
      return null;
    }

    return (
      <SidebarItemLink
        key={item.id}
        item={item}
        IconComponent={IconComponent}
        isActive={isActive}
        collapsed={collapsed}
        depth={depth}
      />
    );
  };

  const config = sidebarConfig as SidebarConfig;

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
                collapsed ? "w-20" : "w-64"
            )}
            role="navigation"
            aria-label="Navegación principal"
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                            <span className="text-white font-bold text-sm">{config.header.logo}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900 line-clamp-2">
                            {config.header.company}
                        </span>
                    </div>
                )}
                {config.header.toggleCollapse && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleCollapse}
                        className="h-8 w-8 text-gray-600 hover:bg-gray-100"
                        aria-label={collapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
                    >
                        {collapsed ? (
                            <Icons.ChevronRight className="h-4 w-4" />
                        ) : (
                            <Icons.ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                {visibleMenu.length > 0 ? (
                    visibleMenu.map((item) => renderItem(item))
                ) : (
                    <div className="text-center py-8 px-4 text-sm text-gray-500">
                        <Icons.LockIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>Sin acceso a módulos</p>
                    </div>
                )}
            </nav>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
                {!collapsed && (
                    <div className="space-y-2">
                        {user && (
                            <div className="text-xs">
                                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-gray-500 truncate">{user.role}</p>
                            </div>
                        )}
                        <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-200">
                            <p>© 2026 Ferretería</p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

interface SidebarItemLinkProps {
    item: SidebarItem;
    IconComponent: React.ComponentType<any>;
    isActive: boolean;
    collapsed: boolean;
    depth: number;
}

const SidebarItemLink: React.FC<SidebarItemLinkProps> = ({
    item,
    IconComponent,
    isActive,
    collapsed,
    depth,
}) => {
    const paddingClass = depth === 0 ? '' : depth === 1 ? 'pl-8' : 'pl-12';

    return (
        <Link
            href={item.route!}
            className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                paddingClass,
                isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
            title={collapsed ? item.label : item.description || item.label}
        >
            <IconComponent
                className={cn(
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-blue-600' : 'text-gray-400'
                )}
            />
            {!collapsed && (
                <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && typeof item.badge !== 'string' && (
    <span
        className={cn(
            'text-xs px-2 py-1 rounded-full text-white font-bold',
            item.badge.color
        )}
    >
        {item.badge.text}
    </span>
)}

                </>
            )}
        </Link>
    );
};

interface SidebarItemWithChildrenProps {
    item: SidebarItem;
    IconComponent: React.ComponentType<any>;
    isActive: boolean;
    collapsed: boolean;
    depth: number;
    pathname: string;
}

const SidebarItemWithChildren: React.FC<SidebarItemWithChildrenProps> = ({
    item,
    IconComponent,
    isActive,
    collapsed,
    depth,
    pathname,
}) => {
    // Expandir si hay un hijo activo
    const hasActiveChild = item.children?.some(
        (child) => pathname === child.route || pathname.startsWith((child.route || '') + '/')
    );

    const [isExpanded, setIsExpanded] = useState(isActive || hasActiveChild || false);

    const paddingClass = depth === 0 ? '' : depth === 1 ? 'pl-8' : 'pl-12';

    return (
        <div key={item.id} className={cn('space-y-1', paddingClass)}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    'w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive || hasActiveChild
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
                aria-expanded={isExpanded}
                title={collapsed ? item.label : item.description || item.label}
            >
                <IconComponent
                    className={cn(
                        'h-5 w-5 flex-shrink-0 transition-colors',
                        isActive || hasActiveChild ? 'text-blue-600' : 'text-gray-400'
                    )}
                />
                {!collapsed && (
                    <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <Icons.ChevronRight
                            className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                isExpanded ? 'rotate-90' : ''
                            )}
                        />
                    </>
                )}
            </button>

            {isExpanded && !collapsed && item.children && item.children.length > 0 && (
                <div className="space-y-1 border-l border-gray-200 ml-2 pl-2">
                    {item.children.map((child) => {
                        const childIsActive = pathname === child.route || pathname.startsWith((child.route || '') + '/');
                        const ChildIconComponent =
                            (Icons[child.icon as keyof typeof Icons] as React.ComponentType<any>) || Icons.FileIcon;

                        return (
                            <Link
                                key={child.id}
                                href={child.route!}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all duration-200',
                                    childIsActive
                                        ? 'bg-blue-50 text-blue-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                                title={child.description || child.label}
                            >
                                <ChildIconComponent
                                    className={cn(
                                        'h-4 w-4 flex-shrink-0 transition-colors',
                                        childIsActive ? 'text-blue-600' : 'text-gray-400'
                                    )}
                                />
                                <span className="flex-1">{child.label}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
