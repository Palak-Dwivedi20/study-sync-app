import React, { useState } from 'react';
import { ReplyBox } from '../ComponentImport';

const NestedReplyBox = ({ reply, doubtId }) => {
    const [showChildren, setShowChildren] = useState(false);

    const hasChildren = reply.children && reply.children.length > 0;

    return (
        <div className="ml-0">
            <ReplyBox
                reply={reply}
                doubtId={doubtId}
                showToggle={hasChildren}
                onToggle={() => setShowChildren(!showChildren)}
                showChildren={showChildren}
            />

            {showChildren && hasChildren && (
                <div className="ml-6 mt-2 border-l border-gray-700 pl-4 space-y-3">
                    {reply.children.map((child) => (
                        <NestedReplyBox
                            key={child._id}
                            reply={child}
                            doubtId={doubtId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NestedReplyBox;