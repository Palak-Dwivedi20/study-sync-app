import { nestReplies } from '../../utils/nestReplies.js';
import { NestedReplyBox } from '../ComponentImport.js';

const ReplyList = ({ replies, doubtId }) => {
  if (!replies || replies.length === 0) {
    return <p className="text-sm text-white text-center mt-4">No replies yet.</p>;
  }

  return (
    <div className="space-y-4 mt-6">
      {replies.map(reply => (
        <NestedReplyBox
          key={reply._id}
          reply={reply}
          doubtId={doubtId}
        />
      ))}
    </div>
  );
};

export default ReplyList;