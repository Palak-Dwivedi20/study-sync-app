
import { DoubtReply } from "../models/doubtReply.model.js";
import { apiError } from "../utils/apiError.js";

const registerDoubtMiddleware = (doubtSchema) => {
    doubtSchema.pre("deleteOne", {
        document: true,
        query: false
    }, async function (next) {
        try {
            await DoubtReply.deleteMany(
                {
                    _id:
                    {
                        $in: this.replies
                    }
                }
            );
            next();

        } catch (error) {
            throw new apiError(401, error?.message);
        }
    });
};

export { registerDoubtMiddleware };
