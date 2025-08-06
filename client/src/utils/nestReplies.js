function nestReplies(flatReplies) {
    const idToReplyMap = {};
    const nested = [];

    flatReplies.forEach(reply => {
        idToReplyMap[reply._id] = {
            ...reply,
            children: [] 
        };
    });

    flatReplies.forEach(reply => {
        if (reply.parentReplyId) {
            const parent = idToReplyMap[reply.parentReplyId];
            if (parent) {
                parent.children.push(idToReplyMap[reply._id]);
            }
        } else {
            nested.push(idToReplyMap[reply._id]);
        }
    });

    return nested;
}

export { nestReplies };