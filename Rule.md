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
| 0 | SERECT_KEY_NOT_EXIST | Serect Key is not exist. |
| 1 | SERECT_KEY_INVALID | Serect Key invalid. |
| 2 | SERECT_KEY_DISABLED | Serect Key disabled. |
| 3 | IP_SERVER_DENY | IP Server deny. |
| 4 | USER_DISABLED | User disabled. |
| 5 | USER_NOT_EXIST_CHANNEL | User not exist channel. |
| 6 | DATA_NO_MATCH | Data no match. |
| 7 | API_KEY_NOT_EXIST | API key not exist. |
| 8 | ACCESS_TOKEN_NOT_EXIST | Access token is not exist. |
| 9 | ACCESS_TOKEN_INVALID | Access token invalid. |
| 10 | API_KEY_DISABLED | API Key disabled. |
| 11 | USER_NOT_EXIST_FOR_AGENCY | User not exist for agency. |
| 12 | DATA_NOT_DELETE | Data not delete. |
| 13 | USER_NOT_EXIST | User not exist. |
| 14 | DATA_NOT_DELETED | Data not delete. |
| 15 | USER_TOKEN_NOT_EXIST | User token not exist. |
| 16 | DATA_NOT_EXIST | Data not exist. |
| 401 | LOGIN_FAILED | Login failed |
