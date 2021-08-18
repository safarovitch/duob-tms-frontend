import React, {
    forwardRef
} from 'react';
import { Helmet } from 'react-helmet';

const Page = forwardRef<HTMLDivElement, {[key: string]: any}>(({
                             title,
                             children,
                             ...rest
                         }, ref) => {

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
