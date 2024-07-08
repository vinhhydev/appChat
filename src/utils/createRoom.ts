export const getRoomId = (currentUserName: string, repUserName: string) => {
  const sortUserName = [currentUserName, repUserName].sort();
  const roomId = sortUserName.join('-');
  return roomId;
};
