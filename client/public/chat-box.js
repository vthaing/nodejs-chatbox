function ChatBoxData (token, brandId, userId, userDisplayName, chatName, channelId = null, channelName = null, roomId = null, roomName = null)  {
    this.token = token;
    this.brandId = brandId;
    this.userId = userId;
    this.userDisplayName = userDisplayName;
    this.chatName = chatName;
    this.channelId = channelId;
    this.channelName = channelName;
    this.roomId = roomId;
    this.roomName = roomName;
    var self = this;

    this.isValid = function () {
        var requiredFields = ['token', 'brandId', 'userId', 'userDisplayName', 'chatName'];
        var result = {status: true, errors: {}};
        requiredFields.map(function (field) {
            if (!self[field]) {
                result.status = false;
                if (!result.errors.hasOwnProperty(field)) {
                    result.errors[field] = [];
                }
                result.errors[field].push('Field ' + field + ' Can not be empty');
            }
        })

        return result;
    }
}

function chatBoxesManagement () {
    this.chatBoxInstances = [];

    this.createNewChatBox = function (chatBoxObject) {

    }

    var self = this;

    /**
     * @param selector
     * @example .chatbox-div #chatbox
     */
    this.initChatBoxFromSelector = function (selector) {
        var elementNodes = document.querySelectorAll(selector);
        for (var i = 0; i < elementNodes.length; i++) {
            var chatBoxData = this.createChatBoxDataFromHtmlElement(elementNodes[i]);
            this.requestAccessToken(
                chatBoxData,
                function () {
                    console.log(this.responseText, 'Get access token requestssss')
                }
            );
        }
    }





    this.createChatBoxDataFromHtmlElement = function (element) {
        return new ChatBoxData(
            element.dataset.token,
            element.dataset.brandId,
            element.dataset.userId,
            element.dataset.userDisplayName,
            element.dataset.chatName,
            element.dataset.channelId ?? null,
            element.dataset.channelName ?? null,
            element.dataset.roomId ?? null,
            element.dataset.roomName ?? null,
        );
    }

    /**
     * @param chatBoxData ChatBoxData
     * @param callback callback
     */
    this.requestAccessToken = function (chatBoxData, callback) {
        var request = new XMLHttpRequest();
        request.addEventListener('load', callback)
        request.open('POST', this.getApiInitChatBoxEndpoint());
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        request.send(JSON.stringify(chatBoxData));
    }

    this.getApiInitChatBoxEndpoint = function () {
        return 'http://localhost:3001/api/brand-chat/init-chat';
    }

}