import React from 'react';

import MMContentContainer from '../../components/common/ContentContainer';
import ChapterList from '../chapter/ChapterList';

export default function Home() {
    return (
        <>
            <MMContentContainer>
                <ChapterList />
            </MMContentContainer>
        </>
    );
}

