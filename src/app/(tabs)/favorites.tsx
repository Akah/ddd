import React from 'react';

import { Favorites } from '../../components/WordsList';

export default function () {
    const [ offset, setOffset ] = React.useState(0);

    function incOffset(): void {
        setOffset(offset + 20);
    }

    return (
        <>
            <Favorites offset={offset} setOffset={incOffset} />
        </>
    )
};
