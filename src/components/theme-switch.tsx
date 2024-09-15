import React, { ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';

interface ThemeSwitcherProps {
    children?: ReactNode;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ children }) => {
    const { theme, setTheme } = useTheme();

    const onChange = (checked: boolean) => {
        setTheme(checked ? 'dark' : 'light');
    };

    return (
        <div className='m-10 mb-1 mt-2'>
            <label>
                <Switch
                className="shadow-muted-foreground shadow-inner"
                checked={theme === 'dark'}
                onCheckedChange={onChange}
                />
            </label>
            {children}
        </div>
    );
};

export default ThemeSwitcher;
