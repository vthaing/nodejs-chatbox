function ChatBoxData(
  token,
  brandId,
  timestamp,
  xNonce,
  userId,
  userDisplayName,
  chatName,
  channelId = null,
  channelName = null,
  roomId = null,
  roomName = null,
) {
  this.token = token;
  this.brandId = brandId;
  this.timestamp = timestamp;
  this.xNonce = xNonce;
  this.userId = userId;
  this.userDisplayName = userDisplayName;
  this.chatName = chatName;
  this.channelId = channelId;
  this.channelName = channelName;
  this.roomId = roomId;
  this.roomName = roomName;
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  var self = this;

  this.isValid = function () {
    var requiredFields = [
      'token',
      'timestamp',
      'xNonce',
      'brandId',
      'userId',
      'userDisplayName',
      'chatName',
    ];
    var result = { status: true, errors: {} };
    requiredFields.map(function (field) {
      if (!self[field]) {
        result.status = false;
        if (!result.errors.hasOwnProperty(field)) {
          result.errors[field] = [];
        }
        result.errors[field].push('Field ' + field + ' Can not be empty');
      }
    });

    return result;
  };
}

function chatBoxesManagement() {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  var self = this;

  this.createErrorMessage = function (chatBoxElement, message) {
    var errorElement = document.createElement('p');
    errorElement.textContent = message;
    errorElement.style = {
      color: 'red',
      fontWeight: 'bold',
    };

    chatBoxElement.append(errorElement);
  };

  this.handleSuccessRequestAccessToken = function (data, chatBoxElement) {
    var jsonData = null;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      this.createErrorMessage(
        chatBoxElement,
        'There is an error while initializing the chat box. Please try again later',
      );
      console.warn(
        'There is an error while initializing the chat box. ' + e.message,
      );
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
  };

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
        this.requestAccessToken(chatBoxData, elementNode);
      } else {
        throw Error(
          'The chat box data is invalid' +
            JSON.stringify(chatBoxDataValidation.errors),
        );
      }
    }
  };

  this.createChatBoxDataFromHtmlElement = function (element) {
    return new ChatBoxData(
      element.dataset.token,
      element.dataset.brandId,
      element.dataset.timestamp,
      element.dataset.xNonce,
      element.dataset.userId,
      element.dataset.userDisplayName,
      element.dataset.chatName,
      element.dataset.channelId ?? null,
      element.dataset.channelName ?? null,
      element.dataset.roomId ?? null,
      element.dataset.roomName ?? null,
    );
  };

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
      });
      self._prepareRequestHeader(request, chatBoxData);
      request.send(JSON.stringify(chatBoxData));
    }, this.delayTime);
    this.delayTime += 100;
  };

  this._prepareRequestHeader = function (xmlRequest, chatBoxData) {
    xmlRequest.setRequestHeader(
      'Content-Type',
      'application/json;charset=UTF-8',
    );

    xmlRequest.setRequestHeader('x-brand-id', chatBoxData.brandId);
    xmlRequest.setRequestHeader('x-token', chatBoxData.token);
    xmlRequest.setRequestHeader('x-timestamp', chatBoxData.timestamp);
    xmlRequest.setRequestHeader('x-nonce', chatBoxData.xNonce);
  };

  this.delayTime = 100;

  this.getApiInitChatBoxEndpoint = function () {
    return ChatBoxEndpointSettings.chatBoxInitEndpoint;
  };

  this.getConversationIframeUrl = function (jsonData) {
    return (
      ChatBoxEndpointSettings.chatBoxConversationEndpoint +
      jsonData.conversation_id
    );
  };
}
