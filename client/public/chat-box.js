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
    var self = this;

    this.createErrorMessage = function (chatBoxElement, message) {
        var errorElement = document.createElement('p')
        errorElement.textContent = message;
        errorElement.style = {
            color: 'red',
            fontWeight: 'bold'
        }

        chatBoxElement.append(errorElement);
    }

    this.handleSuccessRequestAccessToken = function (data, chatBoxElement) {
        var jsonData = null;
        try {
            jsonData = JSON.parse(data);
        } catch (e) {
            this.createErrorMessage(chatBoxElement, "There is an error while initializing the chat box. Please try again later");
            console.warn('There is an error while initializing the chat box. ' + e.message)
            return;
        }

        if (jsonData.error) {
            this.createErrorMessage(chatBoxElement, jsonData.error);
            return;
        }
        var iframe = document.createElement('iframe');
        iframe.src = this.getConversationIframeUrl(jsonData);
        iframe.width = '600px';
        iframe.height = '600px';
        // A tips to transfer the data from parent to iframe
        // @todo: should consider to change the solution
        iframe.name = data;
        chatBoxElement.append(iframe);

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
        //TODO: should have solution to send request parallel
        setTimeout(function () {
            var request = new XMLHttpRequest();
            request.open('POST', self.getApiInitChatBoxEndpoint());
            request.addEventListener('load', function () {
                self.handleSuccessRequestAccessToken(this.responseText, chatBoxElement);
            })
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
            request.send(JSON.stringify(chatBoxData));
        }, this.delayTime);
        this.delayTime += 100;
    }

    this.delayTime = 100;

    //@TODO: should config
    this.getApiInitChatBoxEndpoint = function () {
        return 'http://localhost:3001/api/brand-chat/init-chat';
    }

    //@TODO: should config and do not send restrict data via URL
    this.getConversationIframeUrl = function (jsonData) {
        return 'http://localhost:3000/conversation/'
            + jsonData.conversation_id + '?'
            + 'access_token=' + jsonData.access_token + '&'
            + 'refresh_token=' + jsonData.refresh_token
            ;
    }
}