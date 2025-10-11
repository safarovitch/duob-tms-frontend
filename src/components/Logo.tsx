import React from 'react';

const Logo: React.FC<{className?: string}> = () => {
    return (
        <img
            alt="Logo"
            src="/static/logo.svg"
        />
    );
}

export default Logo;
