export type MessageData = {
    id: string,
    title: string,
    message:string,
    isRead: boolean,
    date: Date,
    sender: string,
    senderProfilePicture: string
};
export type MessageDataList = MessageData[];