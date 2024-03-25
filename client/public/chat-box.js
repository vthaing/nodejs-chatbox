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
        var requiredFields = [
            // @TODO: should require this field
            //'token',
            'brandId', 'userId', 'userDisplayName', 'chatName'
        ];
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

    this.handleSuccessRequestAccessToken = function (data, chatBoxElement) {
        var jsonData = JSON.parse(data);
        chatBoxElement.innerhtml = '<iframe src="' + this.getConversationIframeUrl(jsonData.conversation_id) + '"></iframe>';
    }

    /**
     * @param selector
     * @example .chatbox-div #chatbox
     */
    this.initChatBoxFromSelector = function (selector) {
        var elementNodes = document.querySelectorAll(selector);

        for (var elementNode of elementNodes) {
            var chatBoxData = this.createChatBoxDataFromHtmlElement(elementNode);

            var chatBoxDataValidation = chatBoxData.isValid();
            if (chatBoxDataValidation.status) {
                this.requestAccessToken(
                    chatBoxData,
                    elementNode
                );
            } else {
                throw Error('The chat box data is invalid', chatBoxDataValidation.errors);
            }
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
     * @param chatBoxElement HTMLElementTagNameMap
     */
    this.requestAccessToken = function (chatBoxData, chatBoxElement) {
        var request = new XMLHttpRequest();
        request.addEventListener('load', function () {
            self.handleSuccessRequestAccessToken(this.responseText, chatBoxElement);
        })
        request.open('POST', this.getApiInitChatBoxEndpoint());
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        request.send(JSON.stringify(chatBoxData));
    }

    this.getApiInitChatBoxEndpoint = function () {
        return 'http://localhost:3001/api/brand-chat/init-chat';
    }

    this.getConversationIframeUrl = function (conversationId) {
        return 'http://localhost:3000/conversation/' + conversationId;
    }
}