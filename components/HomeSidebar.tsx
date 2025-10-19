import React from 'react';
import { SuggestedCreatorsWidget } from './widgets/SuggestedCreatorsWidget';

export const HomeSidebar: React.FC = () => {
    return (
        <div className="sticky top-24 space-y-6">
           <SuggestedCreatorsWidget />
        </div>
    );
};