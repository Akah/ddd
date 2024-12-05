import { useGlobalSearchParams } from 'expo-router';
import React from 'react';

import { WordsList } from '../../components/WordsList';
import { LIST_RENDER_BATCH } from '../../constants';

export default function Search() {
    const global = useGlobalSearchParams();
    const [ offset, setOffset ] = React.useState(0);

    function incOffset(): void {
        setOffset(LIST_RENDER_BATCH + 40);
    }
    return (
        <>
            <WordsList
                offset={offset}
                setOffset={incOffset}
                search={global.search}
            />
        </>
    )
};
