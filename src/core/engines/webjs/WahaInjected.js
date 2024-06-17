exports.LoadUtils = () => {
  window.WAHA = {};

  window.WAHA.getChats = async (limit, offset) => {
    let chats = window.Store.Chat.getModelsArray();
    if (limit || offset) {
      offset = offset || 0;
      limit = limit || Infinity;
      chats = chats.slice(offset, offset + limit);
    }

    const chatPromises = chats.map((chat) => window.WWebJS.getChatModel(chat));
    return await Promise.all(chatPromises);
  };
};
