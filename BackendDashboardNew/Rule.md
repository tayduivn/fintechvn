## Response

Các phản hồi từ API đều phải được trả về theo cấu trúc sau:

```json
{
    "error" : null | { "message" : "Content message", "code" : "CODE_ERROR", "num" : 999 },
    "data" : null | {}
}
```

Trong đó:
- Error : `null` khi không có lỗi gì xảy ra, nếu có lỗi thì trả về một đối tượng chưa các tham thuộc tính: `message`, `code`, `num`.
- Data : `null` khi có lỗi xảy ra, ngược lại sẽ trả về  một dữ liệu tùy vào URL.

## Error Core

| Number | Code | Messsh sage |
|--------|------|---------|
| 0 | IP_NOT_EXIST | Ip is not exist. |
| 1 | IP_INVALID | Ip invalid. |
| 2 | ACCESS_TOKEN_NOT_EXIST | Access token is not exist. |
| 3 | SERVER_DISCONNECT | Server disconnect. |
| 4 | USER_NOT_EXIST_FOR_TOKEN | User not exist for token. |
| 5 | USER_DISABLED | User disabled. |
| 6 | DATA_NO_MATCH | Data no match.  |
| 401 | LOGIN_FAILED | Login failed |
