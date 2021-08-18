import React, {forwardRef} from 'react';
import { Helmet } from 'react-helmet';

const Page = forwardRef(
    ({title, children, ...rest}: {title: string, children: React.ReactNode, className?: string},
     ref: React.Ref<HTMLDivElement>) => {
    return (
        <div
            ref={ref}
            {...rest}
        >
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {children}
        </div>
    );
});

export default Page;
