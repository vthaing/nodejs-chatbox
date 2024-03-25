# React Chat app

## Tích hợp chat box vào Brand website

### Brand Secret key

- Đây là mã bí mật của brand để tạo request token. Chat box server sẽ dựa vào token này để xác thực chính xác 1 request đến từ brand

- Admin sẽ truy cập vào admin UI và cung cấp secret key cho brand https://{adminURL}/brands/show/63b982a370ee0e49ae4ac8fa
<img src="documents/screens/01_brand_secrect_key.png"  width="600" height="300">

### Request token:
- Request token sẽ được sử dụng để xác thực request đến từ 1 brand
- Request token sẽ có hiệu lực trong vòng 5 giây kể từ thời điểm được tạo
- Là 1 chuỗi được tạo từ các thành phần sau:

  - `secretToken`: mã bí mật được admin cung cấp cho brand. Khi bị lộ mã này thì cần báo cho admin biết để được cấp mã mới.
  - `x-nonce`: là 1 chuỗi ngẫu nhiên brand cung cấp cho website thông qua request header `x-nonce`
  - `x-timestamp`: là giá trị timestamp thời điểm hiện tại. (UTC 0). Sẽ được gởi tới brand thông qua request header `x-timestamp`.
  - `x-brand-id`: là id của brand. Sẽ được admin cấp cho. Mã này là duy nhất và không bao giờ đổi được.
- Sample code để tạo request token
```javascript
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';

const BRAND_AUTH_HASH_ALGORITHM = 'sha1';
const BRAND_AUTH_HASH_DIGEST = 'hex';

const generateToken = (brandId, secretKey, xNonce, xTimestamp) => {
  const headerMissingToken = {
    'x-nonce': xNonce,
    'x-timestamp': xTimestamp,
    'x-brand-id': brandId,
  };

  console.log('header missing token', headerMissingToken);
  console.log('secret key', secretKey);

  const sortedRequestProperties = Object.keys(headerMissingToken)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = headerMissingToken[key];
      return accumulator;
    }, {});

  console.log('sortedRequestProperties', sortedRequestProperties);
  const requestString = new URLSearchParams(
    sortedRequestProperties,
  ).toString();

  console.log('requestString', requestString);

  return crypto
    .createHmac(BRAND_AUTH_HASH_ALGORITHM, secretKey)
    .update(requestString)
    .digest(BRAND_AUTH_HASH_DIGEST);
  }

  // 63b109ab1d33d74995325a91
  const xBrandId = '63b982a370ee0e49ae4ac8fa';
  
  // xCmOGVhD1cb8F3exdj2lg75NaoNcgS0dzlN3lu0DnI6ChnDkMneBDvqdpbuaJIqua/S2ZU3IjKB3DLb0n9MzpEUNJjt42YwSPt9WOIJb5Cb+ibCzvANX5MSlCOhgWyXZCRwbohGDl+G9awKy7qERoTkOmGbY5+axlmIzbzCZ75vCszHmAsiqHo8A5c16LJLaC4OdIpZ/F/zTdFF9Xp3a6TMwlc9dIpJn0V02Jk2jN1g5/DhdFbU8QQ2D7oAoq4EZOSbKwzUJcrV9f//BcRolkdFfC1RMyz9Ph1GMRHtmM1f9hW+vhqGprs2Qndq6noQkxxZNg0sya1xCPXzw1kcngQ==
  const secretKey = process.env.brandSecretToken;// We should save the secret key in the server environment variable
  
  // 6bf647c4-f779-4ac8-a332-d0b56cee66a3
  const xNonce = randomStringGenerator();
  
  // 1675420858134
  const xTimeStamp = Date.now();// Please Make sure this will return the UTC 0 value
  
  const requestToken = generateToken(
    xBrandId,
    secretKey,
    xNonce,
    xTimeStamp
  );
  console.log('requestToken', requestToken);
```

- Sau đây là log khi chạy đoạn code trên với các giá trị tương ứng:

```composer log
header missing token {
  'x-nonce': '6bf647c4-f779-4ac8-a332-d0b56cee66a3',
  'x-timestamp': 1675420858134,
  'x-brand-id': '63b109ab1d33d74995325a91'
}
secretKey: xCmOGVhD1cb8F3exdj2lg75NaoNcgS0dzlN3lu0DnI6ChnDkMneBDvqdpbuaJIqua/S2ZU3IjKB3DLb0n9MzpEUNJjt42YwSPt9WOIJb5Cb+ibCzvANX5MSlCOhgWyXZCRwbohGDl+G9awKy7qERoTkOmGbY5+axlmIzbzCZ75vCszHmAsiqHo8A5c16LJLaC4OdIpZ/F/zTdFF9Xp3a6TMwlc9dIpJn0V02Jk2jN1g5/DhdFbU8QQ2D7oAoq4EZOSbKwzUJcrV9f//BcRolkdFfC1RMyz9Ph1GMRHtmM1f9hW+vhqGprs2Qndq6noQkxxZNg0sya1xCPXzw1kcngQ==
sortedRequestProperties {
  'x-brand-id': '63b109ab1d33d74995325a91',
  'x-nonce': '6bf647c4-f779-4ac8-a332-d0b56cee66a3',
  'x-timestamp': 1675420858134
}
requestString x-brand-id=63b109ab1d33d74995325a91&x-nonce=6bf647c4-f779-4ac8-a332-d0b56cee66a3&x-timestamp=1675420858134
requestToken 9c70078a4ffd9d2dc52d9cbd638f77bebd82ea8e
```

### Sử dụng request token để gởi request tới API chat box

- Khi gởi request tới các endpoint của ChatBox API thì cần phải attach các fields sau lên header:
  - `x-nonce`: là 1 chuỗi ngẫu nhiên brand cung cấp cho website thông qua request header `x-nonce`
  - `x-timestamp`: là giá trị timestamp thời điểm hiện tại. (UTC 0). Sẽ được gởi tới brand thông qua request header `x-timestamp`.
  - `x-brand-id`: là id của brand. Sẽ được admin cấp cho. Mã này là duy nhất và không bao giờ đổi được.
  - `x-token`: là token được tạo từ các thành phần trên.
- Sau đây là sample code để gởi gởi request cập nhật trạng thái của user trên brand
```javascript
    const xBrandId = this.configService.get('brandId');
    const secretKey = this.configService.get('chatBoxSecretKey');
    const xNonce = randomStringGenerator();
    const xTimeStamp = Date.now();
    const requestToken = this.generateToken(
      xBrandId,
      secretKey,
      xNonce,
      xTimeStamp,
    );

    return axios
      .patch(
        this.configService.get('chatBoxApiBaseUrl') + 'brand-chat/user/' + id,
        {
          displayName: displayName,
          enabled: status,
        },
        {
          headers: {
            'x-brand-id': xBrandId,
            'x-timestamp': xTimeStamp,
            'x-nonce': xNonce,
            'x-token': requestToken,
            'Content-Type': 'application/json',
          },
        },
      )
      .then((response) => {
        if (response.status !== 200) {
          return res.send(JSON.stringify(response));
        }
        return res.redirect('/simple-chat-box');
      })
      .catch((error) => {
        return res.send(error.toJSON());
      });
```

### Nhúng chat box vào brand website

- Chèn thư viện chat box vào header:
```html
<script src="http://localhost:3001/api/client-scripts/chat-box.js"></script>
```
- Bổ sung đoạn HTML code sau vào khu vực muốn hiển thị chat box
```html
<div class="chatbox"
     data-brand-id="63b109ab1d33d74995325a91"
     data-chat-name="Góc bàn đề"
     data-channel-id="channel_dai_tien_giang"
     data-channel-name="Đài Tiền Giang"
     data-room-id="room_tg_xs_chu_nhat"
     data-room-name="Xổ số Tiền Giang chủ nhật"
     data-user-id="12345678"
     data-user-display-name="Anh Ba Khía"
     data-timestamp="1675500677057"
     data-x-nonce="6ac8783d-b4e0-4247-8553-4e7982f8d28b"
     data-token="aa2c9df716f244bebcf91bedd3685a070c2f254f"
></div>
```
| Name                   | Required | Description                                                                                                                                                  |
|------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data-brand-id          | Yes      | ID của Brand                                                                                                                                                 |
| data-chat-name         | Yes      | Tên của chat box                                                                                                                                             |
| data-channel-id        | No       | ID của channel. Một channel sẽ có nhiều rooms                                                                                                                |
| data-channel-name      | No       | Tên của channel                                                                                                                                              |
| data-room-id           | No       | ID của room                                                                                                                                                  |
| data-room-name         | No       | Tên của room                                                                                                                                                 |
| data-user-id           | Yes      | ID của user                                                                                                                                                  |
| data-user-display-name | Yes      | Tên hiển thị của user trên chat box. Chat box server sẽ sử dụng tên này trong lần đầu sử dụng. Để cập nhật lại thì cần phải gọi API update user brand status |
| data-timestamp         | Yes      | Timestamp UTC. Là giá trị timestamp thời điểm hiện tại. (UTC 0)                                                                                              |
| data-x-nonce           | Yes      | Là 1 chuỗi ngẫu nhiên                                                                                                                                        |
| data-token             | Yes      | Request token                                                                                                                                                |

- Bổ sung đoạn mã sau ở cuối body

```html

<script>
  var initChatboxes = function () {
    var chatBoxObject = new ChatBoxesManagement();
    chatBoxObject.initChatBoxFromSelector('.chatbox');
  }
  document.addEventListener("DOMContentLoaded", function () {
    initChatboxes();
  });
</script>
```

- `chatBoxObject.initChatBoxFromSelector('.chatbox')`: có thể sử dụng HTMLID  hoặc bất cứ tham số nào của hàm `document.querySelectorAll`

### Sample code

Xem code mẫu tại [Nhiều chat box trên 1 page](example/src/app.controller.ts) hoặc [Cập nhật tên user trên chat box](example/src/simple-chat-box.controller.ts)

## Frontend App (client-folder)

Just install the dependencies and start the app:

```text
npm i

npm run start
```

## Backend (server folder)

If you have docker installed on your machine just
run the `docker-compose` file to set up the following images:

* Mongodb
* Redis


```text
docker-compose up -d 
```


Install the dependencies

```text
npm i
```

Run the server on development mode

```text
npm run start:dev
```